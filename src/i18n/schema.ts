export interface Decision {
  title: string;
  text: string;
}

export interface ProjectText {
  name: string;
  category: string;
  line: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  /** Empty when there is nothing documented to say; the tab is then hidden. */
  decisions: readonly Decision[];
  /** Steps of the request flow, drawn as the system diagram. */
  flow: readonly string[];
}

/** Name and one-line description of a C4 node. The same node id is reused across the C4 levels of a project. */
export interface C4Text {
  n: string;
  d: string;
}
