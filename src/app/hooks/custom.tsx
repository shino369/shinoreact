import React from "react";
import { Observable } from "rxjs";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

export function useObservable<T>(observable$: Observable<T>, initialValue: T) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    const subscription = observable$.subscribe((v) => setValue(v));

    return () => subscription.unsubscribe();
  }, [observable$]);

  return value;
}

export function useAnimation() {
  React.useEffect(() => {

    gsap.registerPlugin(ScrollTrigger);
    const animateFrom = (elem: any, _direction?: number) => {
      const direction = _direction || 1;
      var x = 0,
        y = direction * 1000;
      if (elem.classList.contains("gs_reveal_fromLeft")) {
        x = -100;
        y = 0;
      } else if (elem.classList.contains("gs_reveal_fromRight")) {
        x = 100;
        y = 0;
      }
      elem.style.transform = "translate(" + x + "px, " + y + "px)";
      elem.style.opacity = "0";
      gsap.fromTo(
        elem,
        { x: x, y: y, autoAlpha: 0 },
        {
          duration: 1.25,
          x: 0,
          y: 0,
          autoAlpha: 1,
          ease: "expo",
          overwrite: "auto",
        }
      );
    };

    const hide = (elem: any) => {
      gsap.set(elem, { autoAlpha: 0 });
    };

    gsap.utils.toArray(".gs_reveal").forEach((elem: any) => {
      hide(elem); // assure that the element is hidden when scrolled into view

      ScrollTrigger.create({
        once: true,
        trigger: elem,
        onEnter: () => {
          animateFrom(elem);
        },
        // onEnterBack: () => {
        //   animateFrom(elem, -1)
        // },
        // onLeave: () => {
        //   hide(elem)
        // }, // assure that the element is hidden when scrolled into view
      });
    });

    return () => gsap.killTweensOf('.gs_reveal');
  }, []);
}
