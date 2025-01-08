const formElement = document.querySelector("form");
formElement.onsubmit = (e) => {
  e.preventDefault();
  const form = new FormData(formElement);
  const firstName = encodeURIComponent(form.get("first-name"));
  const lastName = encodeURIComponent(form.get("last-name"));
  const email = encodeURIComponent(form.get("email"));
  const phone = encodeURIComponent(form.get("tel"));
  const challenge = encodeURIComponent(form.get("challenge"));
  const subject = encodeURIComponent("Book Counselling");
  const body = `First Name: ${firstName}%0ALast Name: ${lastName}%0AEmail: ${email}%0APhone Number: ${phone}%0AChallenge: ${challenge}`;
  window.location.href = `mailto:bannyconfidence@gmail.com?subject=${subject}&body=${body}`;
};
