import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }

  ha-card {
    height: 100%;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color, #212121);
  }

  .card {
    display: grid;
    gap: 12px;
    min-width: 0;
    padding: 16px;
  }

  .card.compact {
    gap: 10px;
    padding: 12px;
  }

  .card.vertical .header {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .card.vertical .state {
    justify-self: start;
  }

  .header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 0;
    border-radius: 999px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    overflow: hidden;
  }

  .icon.square {
    border-radius: 8px;
  }

  .icon.rounded {
    border-radius: 14px;
  }

  .icon.active {
    color: var(--primary-color, #03a9f4);
    background: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
  }

  .entity-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .title,
  .subtitle,
  .state {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
  }

  .subtitle,
  .state,
  .chip {
    color: var(--secondary-text-color, #727272);
    font-size: 12px;
  }

  .state {
    justify-self: end;
    max-width: 120px;
    font-weight: 600;
  }

  .body {
    display: grid;
    gap: 10px;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    min-height: 24px;
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 999px;
    padding: 0 8px;
    background: color-mix(in srgb, var(--secondary-background-color, #f3f3f3) 80%, transparent);
  }

  .controls,
  .tiles {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }

  button.text,
  select,
  input[type="range"] {
    min-height: 36px;
  }

  button.text,
  select {
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 10px;
    background: var(--secondary-background-color, #f3f3f3);
    color: var(--primary-text-color, #212121);
    cursor: pointer;
    padding: 0 12px;
    font: inherit;
  }

  button.text:hover,
  select:hover {
    border-color: var(--primary-color, #03a9f4);
  }

  button.text:focus-visible,
  select:focus-visible,
  input[type="range"]:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  button:disabled,
  select:disabled,
  input:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  select {
    min-width: 132px;
    max-width: 100%;
  }

  input[type="range"] {
    flex: 1 1 150px;
    min-width: 140px;
    accent-color: var(--primary-color, #03a9f4);
  }

  .tile {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
    flex: 1 1 150px;
    min-width: 140px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 10px;
    padding: 10px;
    background: color-mix(in srgb, var(--secondary-background-color, #f3f3f3) 72%, transparent);
  }

  .tile strong,
  .tile span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .error {
    border-radius: 8px;
    padding: 8px 10px;
    color: var(--error-color, #db4437);
    background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
    font-size: 12px;
  }

  .empty {
    color: var(--secondary-text-color, #727272);
    font-size: 13px;
  }

  @container (max-width: 360px) {
    .card {
      padding: 12px;
    }

    .header {
      grid-template-columns: auto minmax(0, 1fr);
    }

    .state {
      grid-column: 2;
      justify-self: start;
      max-width: 100%;
    }

    .controls,
    .tiles {
      display: grid;
      grid-template-columns: 1fr;
    }

    input[type="range"],
    .tile,
    select {
      min-width: 0;
      width: 100%;
    }
  }
`;
