export type HeaderSearchResult =
  | {
      type: "medicine";
      id: number;
      title: string;
      description: string;
      path: string;
    }
  | {
      type: "customer";
      id: number;
      title: string;
      description: string;
      path: string;
    }
  | {
      type: "supplier";
      id: number;
      title: string;
      description: string;
      path: string;
    }
  | {
      type: "shortcut";
      id: string;
      title: string;
      description: string;
      path: string;
    };
