/// <reference types="vite/client" />

// ldrs web-component elements (l-line-spinner, l-dot-spinner, l-zoomies)
declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "l-line-spinner": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        size?: string;
        stroke?: string;
        speed?: string;
        color?: string;
      };
      "l-dot-spinner": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        size?: string;
        speed?: string;
        color?: string;
      };
      "l-zoomies": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        size?: string;
        stroke?: string;
        "bg-opacity"?: string;
        speed?: string;
        color?: string;
      };
    }
  }
}
