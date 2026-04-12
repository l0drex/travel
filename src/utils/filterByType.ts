export function filterElements(parent: HTMLElement) {
  const selectedType = getSelectedType();

  const showAll = selectedType == "all";
  (parent.childNodes as NodeListOf<HTMLElement>).forEach((child) => {
    child.hidden = !showAll;
  });

  if (showAll) {
    return;
  }

  parent.querySelectorAll<HTMLElement>(`.${selectedType}`).forEach((child) => {
    child.hidden = false;
  });
}

export function getSelectedType(): string {
  return new URL(document.URL).searchParams.get("type") ?? "all";
}
