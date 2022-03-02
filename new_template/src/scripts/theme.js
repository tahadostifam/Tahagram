window.onload = () => {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mousedown", function (e) {
      let x = e.clientX - e.target.offsetLeft;
      let y = e.clientY - e.target.offsetTop;

      let ripples = document.createElement("div");
      ripples.classList.add("__ripple__");

      ripples.style.left = x + "px";
      ripples.style.top = y + "px";
      this.appendChild(ripples);

      setTimeout(() => {
        ripples.remove();
      }, 1000);
    });
  });
};
