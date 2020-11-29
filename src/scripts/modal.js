export function askUsername(onSubmit) {
    const wrapper = document.createElement("div");
    const input = document.createElement("input");
    const button = document.createElement("button");

    wrapper.classList.add("ask-username-wrapper");
    wrapper.appendChild(input);
    wrapper.appendChild(button);

    input.setAttribute("type", "text");
    input.setAttribute("id", "username");
    input.setAttribute("placeholder", "Username");
    input.setAttribute('maxlength', '12');
    input.addEventListener("keypress", (event) => {
        if(event.key === "Enter") {
            event.preventDefault();
            button.click();
        }

        if(!isNaN(parseInt(event.key))){
            event.preventDefault();
        }

        if(event.key.trim() === "") {
            event.preventDefault();
        }
    })
    input.setAttribute("required", "true")

    button.classList.add("submit");
    button.setAttribute("type", "button");
    button.innerText = "Submit"

    let messageTimeout = setTimeout(() => {});
    const message = document.createElement("small");
    button.addEventListener("click", () => {
        if(input.value === "") {
            clearTimeout(messageTimeout);
            message.innerText = "username can't be empty";
            wrapper.insertBefore(message, input);
            messageTimeout = setTimeout(() => {
                message.innerText = "";
            }, 3000);
        } else {
            onSubmit(input.value);
        }
    })

    setTimeout(() => {
        wrapper.classList.add("show")
    }, 500);
    document.body.appendChild(wrapper);
}
