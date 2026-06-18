import type { CardDefinition } from "./types";

export const EDITOR_TAG = "ha-yeelight-card-editor";
export const LEGACY_EDITOR_TAG = "yeelight-card-editor";

export function createEditorElement(definition: Pick<CardDefinition, "type">): HTMLElement {
  const editor = document.createElement(EDITOR_TAG) as HTMLElement & { cardType?: string };
  editor.cardType = definition.type;
  return editor;
}
