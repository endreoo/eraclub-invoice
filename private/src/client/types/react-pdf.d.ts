declare module '@react-pdf/renderer' {
  import { ComponentType, ReactNode } from 'react';

  interface Style {
    [key: string]: any;
  }

  interface DocumentProps {
    children?: ReactNode;
  }

  interface PageProps {
    size?: string;
    style?: Style;
    children?: ReactNode;
  }

  interface ViewProps {
    style?: Style;
    children?: ReactNode;
  }

  interface TextProps {
    style?: Style;
    children?: ReactNode;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const StyleSheet: {
    create: <T extends { [key: string]: Style }>(styles: T) => T;
  };
} 