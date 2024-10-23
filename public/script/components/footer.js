export default function currentYear() {
  const date = new Date();
  const year = date.getFullYear();
  const currentYearSpan = document.querySelector("#currentYear");

  currentYearSpan.textContent = year;
}
