# React nav handler

Decouple navigation requests from url changes.

## Rationale

Components may sometimes request to change the url. For example, a `HelpButton` component
may want to navigate to the help screen when pressed. If you want to reuse such a component
in different contexts, then the required url change may depend on the context. For example,
in the context of the "editor" page the help button should navigate to "/editor/help", but
in the context of the "dashboard" page the button should navigate to "/dashboard/help".

This problem can be solved by informing the `HelpButton` about its context, or by explicitly
passing a url into the `HelpButton`. Although this simple solution is usually all you need,
there are cases where it leads to a lot of prop drilling, especially when components are
reused in different locations. In those cases, the code will be simpler and cleaner if components
can just call `navToHelp` and remain agnostic of the exact url change that is required.

We can achieve this by adding so-called navigation pages to the url-router. When a navigation page
is mounted, it registers itself and its associated url in the navigation handler. In the example
code below, the `EditorNavPage` is associated with `/editor` and the `DashboardNavPage`
is associated with `/dashboard`. When a component calls `navToHelp` then this request is passed
(under the hood) to the navigation handler, who will call the `navToHelp` function of the navigation
page that matches the current url. This means that depending on the current url, the `HelpButton`
will navigate to `/dashboard/help` or to `/editor/help`.

## Synopsis

```tsx
// navEvents.ts
export const navToHelp = (): void => {
  navHandler.getNavFn('navToHelp', navToHelp)();
}

// DashboardNavPage.tsx
import { useInstallNavPage } from 'react-nav-handler';
import { navToHelp } from 'navEvents';

export const DashboardNavPage = (props: { children }) => {
  useInstallNavPage(
    'DashboardNavPage',
    {
      navToHelp: (() => {
        history.push('/dashboard/help');
      }) as typeof navToHelp,
    }
  );
  return <>{props.children}</>;
};

// EditorNavPage.tsx
import { useInstallNavPage } from 'react-nav-handler';
import { navToHelp } from 'navEvents';

export const EditorNavPage = (props: { children }) => {
  useInstallNavPage(
    'EditorNavPage',
    {
      navToHelp: (() => {
        history.push('/editor/help');
      }) as typeof navToHelp,
    }
  );
  return <>{props.children}</>;
};

// UrlRouter.tsx
import { DashboardNavPage } from 'DashboardNavPage';
import { EditorNavPage } from 'EditorNavPage';

export const UrlRouter = () => {
  return (
    <>
      <DashboardNavPage>
        <Route path="/dashboard">
          <HelpButton />
        </Route>
      </DashboardNavPage>
      <EditorNavPage>
        <Route path="/editor">
          <HelpButton />
        </Route>
      </EditorNavPage>
    </>
  )
}

// HelpButton.tsx
import { navToHelp } from 'navEvents';

export const HelpButton = () => {
  return (
    <button onClick={() => navToHelp()}>Help</button>;
  )
}
```

## More fine-grained control

The proposed approach to navigation is unusual, because navigation happens based on the current url, but not on the caller.
Specifically, if the caller is a React component, then it doesn't matter in which part of the rendering tree that
component is located. This can be too coarse grained though. For example, imagine that we're on the url `/editor` and we're showing
an `Editor` component that has a `HelpButton`. Following the previous example, when we press this button, we will navigate to
`/editor/help`. However, the page may also have a `HelpButton` in the application frame that should always navigate
to `/help`. To support such cases, you can add a `requesterId` in the call to `navToHelp`.

```tsx
// navEvents.ts
export const navToHelp = (requesterId: string): void => {
  navHandler.getNavFn('navToHelp', navToHelp)(requesterId);
};

// EditorNavPage.tsx
export const EditorNavPage = (props: { children }) => {
  useInstallNavPage('EditorNavPage', {
    navToHelp: ((requesterId: string) => {
      if (requesterId !== 'Editor') return false;
      history.push('/editor/help');
    }) as typeof navToHelp,
  });
  return <>{props.children}</>;
};
```

What this communicates is that `EditorNavPage` will handle `navToHelp` requests from "Editor", but not from other requesters.
When a navivation function returns `false` then `navHandler` will continue by passing the navigation request to the
next navigation page. Of course, you must ensure that one of the mounted navigation pages processes the requests,
or an error will be thrown.
