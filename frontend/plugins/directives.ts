import Vue from "vue"

Vue.directive("lazy-image", {
    inserted: (e: any) => {
        e.addEventListener("load", () => {
            e.classList.add("image__loaded");
        })
    }
})