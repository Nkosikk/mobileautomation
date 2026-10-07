package automation.reporting;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public final class ExtentReportGenerator {
    private ExtentReportGenerator() {}

    public static void main(String[] args) throws Exception {
        if (args.length < 3) {
            throw new IllegalArgumentException(
                "Usage: <output-html> <report-name> <junit-path> [<junit-path> ...]"
            );
        }

        Path output = Path.of(args[0]).toAbsolutePath();
        String reportName = args[1].replace('_', ' ');
        Files.createDirectories(output.getParent());

        ExtentSparkReporter spark = new ExtentSparkReporter(output.toString());
        spark.config().setDocumentTitle(reportName);
        spark.config().setReportName(reportName);

        ExtentReports extent = new ExtentReports();
        extent.attachReporter(spark);
        extent.setSystemInfo("Environment", System.getenv().getOrDefault("CI", "local"));
        extent.setSystemInfo("Java", System.getProperty("java.version"));
        extent.setSystemInfo("Operating System", System.getProperty("os.name"));

        List<Path> resultFiles = findResultFiles(args);
        int testCount = 0;
        for (Path resultFile : resultFiles) {
            testCount += addResults(extent, resultFile, reportName);
        }

        if (testCount == 0) {
            extent.createTest(reportName)
                .skip("No JUnit test results were found.");
        }

        extent.flush();
        System.out.printf(
            "Generated Extent report with %d tests: %s%n",
            testCount,
            output
        );
    }

    private static List<Path> findResultFiles(String[] args) throws IOException {
        List<Path> files = new ArrayList<>();
        for (int index = 2; index < args.length; index++) {
            Path input = Path.of(args[index]);
            if (!Files.exists(input)) {
                continue;
            }
            if (Files.isRegularFile(input) && input.toString().endsWith(".xml")) {
                files.add(input);
                continue;
            }
            if (Files.isDirectory(input)) {
                try (var paths = Files.walk(input)) {
                    paths.filter(Files::isRegularFile)
                        .filter(path -> path.toString().endsWith(".xml"))
                        .sorted()
                        .forEach(files::add);
                }
            }
        }
        return files;
    }

    private static int addResults(
        ExtentReports extent,
        Path resultFile,
        String reportName
    ) throws ParserConfigurationException, IOException, SAXException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setFeature(
            "http://apache.org/xml/features/disallow-doctype-decl",
            true
        );
        factory.setFeature(
            "http://xml.org/sax/features/external-general-entities",
            false
        );
        factory.setFeature(
            "http://xml.org/sax/features/external-parameter-entities",
            false
        );
        factory.setExpandEntityReferences(false);

        NodeList cases = factory.newDocumentBuilder()
            .parse(resultFile.toFile())
            .getElementsByTagName("testcase");

        for (int index = 0; index < cases.getLength(); index++) {
            Element testCase = (Element) cases.item(index);
            String className = testCase.getAttribute("classname");
            String testName = testCase.getAttribute("name");
            String displayName = className.isBlank()
                ? testName
                : className + " - " + testName;

            ExtentTest test = extent.createTest(displayName)
                .assignCategory(reportName);

            String duration = testCase.getAttribute("time");
            if (!duration.isBlank()) {
                test.info("Duration: " + duration + " seconds");
            }

            Element failure = firstElement(testCase, "failure");
            Element error = firstElement(testCase, "error");
            Element skipped = firstElement(testCase, "skipped");

            if (failure != null) {
                test.fail(resultMessage(failure));
            } else if (error != null) {
                test.fail(resultMessage(error));
            } else if (skipped != null) {
                test.skip(resultMessage(skipped));
            } else {
                test.pass("Passed");
            }
        }
        return cases.getLength();
    }

    private static Element firstElement(Element parent, String tagName) {
        NodeList elements = parent.getElementsByTagName(tagName);
        return elements.getLength() == 0 ? null : (Element) elements.item(0);
    }

    private static String resultMessage(Element result) {
        String message = result.getAttribute("message");
        if (!message.isBlank()) {
            return message;
        }
        String text = result.getTextContent().trim();
        return text.isBlank() ? result.getTagName() : text;
    }
}
