import { useState } from "react";
import { Helmet } from "react-helmet";
import { CenterColumn, H1, Spacer, TextCenter } from "../core";
import { AppContainer } from "../shared/AppContainer";

export function AddToHomeScreen(): JSX.Element {
  const icons = ["icon1.png", "icon2.png", "icon3.png"];
  const [icon, setIcon] = useState(icons[0]);

  return (
    <AppContainer bg="gray">
      <Helmet>
        <link rel="apple-touch-icon" href={icon} />
      </Helmet>
      <CenterColumn w={290}>
        <TextCenter>
          <Spacer h={64} />
          <H1>Add to Home Screen</H1>
          <p>
            Select an icon and use your browser’s “Add to Home Screen”
            functionality to install Zupass as a Progressive Web App (PWA).
          </p>
          <select value={icon} onChange={(e) => setIcon(e.target.value)}>
            {icons.map((icon, index) => (
              <option key={index} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </TextCenter>
      </CenterColumn>
    </AppContainer>
  );
}
