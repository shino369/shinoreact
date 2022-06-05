import React from "react";
import { Observable } from "rxjs";

export function useObservable<T>(observable$: Observable<T>, initialValue: T) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    const subscription = observable$.subscribe((v) => setValue(v));

    return () => subscription.unsubscribe();
  }, [observable$]);

  return value;
}