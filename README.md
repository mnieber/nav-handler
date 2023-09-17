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
export const navToHelp = (): void => navHandler.getNavFn('navToHelp', navToHelp)();

// DashboardNavPage.tsx
import { useInstallNavPage } from 'react-nav-handler';
import { navToHelp } from 'navEvents';

export const DashboardNavPage = (props: { children }) => {
  useInstallNavPage(
    'DashboardNavPage',
    {
      navToHelp: (() => { history.push('/dashboard/help'); }) as typeof navToHelp,
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
      navToHelp: (() => { history.push('/editor/help'); }) as typeof navToHelp,
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
