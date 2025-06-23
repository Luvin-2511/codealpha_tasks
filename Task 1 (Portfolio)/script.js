


let page = document.querySelector("main");
let hover = document.querySelector(".baharcircle");
page.addEventListener("mouseenter", () => {
    gsap.to(hover, {
        scale: 1,
        opacity: 1
    })
})
page.addEventListener("mouseleave", () => {
    gsap.to(hover, {
        scale: 0,
        opacity: 0
    })
})
page.addEventListener("mousemove", (dets) => {
    gsap.to(hover, {
        left: dets.x - 50,
        top: dets.y - 50
    })
})


gsap.from(".leftSection", {
    y: 100,
    opacity: 0,
    delay: 0.2,
    duration: 0.6,
    stagger: 0.5
})

let tl = gsap.timeline()

tl.from(".loader h2",{
    x:200,
    opacity:0,
    delay:0.2,
    duration:1,
    stagger:0.2
})
tl.to(".loader h2",{
    x:-40,
    opacity:0,
    delay:0,
    duration:0.3,
    stagger:-0.2
})
tl.to(".loader",{
   opacity:0,
   display:"none"
})