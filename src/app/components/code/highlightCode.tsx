import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";
import { useEffect } from "react";

interface Props {
  className: string;
  language: string;
  children: any;
}

const HighlightCode: React.FC<Props> = ({ className, language, children }) => {
  hljs.registerLanguage("javascript", typescript);

  useEffect(() => {
    hljs.configure({
      languages: ["typescript"],
      ignoreUnescapedHTML: true,
    });
    const codes = document.querySelectorAll("pre code");
    codes.forEach((el) => {
      hljs.highlightBlock(el as HTMLElement);
    });
  }, []);

  return (
    <pre>
      <code className={`${className} ${language}`}>{children}</code>
    </pre>
  );
};

export default HighlightCode;
