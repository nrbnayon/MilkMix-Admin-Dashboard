// src/types/lord-icon.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          trigger?: string;
          colors?: string;
          stroke?: number;
          delay?: number;
          state?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
