"""Syntax-check the inline browser JavaScript without executing browser APIs."""
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FrontendSyntaxTests(unittest.TestCase):
    def test_inline_browser_script_parses(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        scripts = re.findall(r"<script>([\s\S]*?)</script>", html)
        self.assertEqual(len(scripts), 1, "Expected exactly one inline app script")
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "app.js"
            path.write_text(scripts[0], encoding="utf-8")
            result = subprocess.run(["node", "--check", str(path)],
                                    capture_output=True, text=True, check=False)
            self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
