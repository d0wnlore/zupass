import { useState } from "react";
import { Helmet } from "react-helmet";
import Select, { components } from "react-select";
import { CenterColumn, H1, Spacer, TextCenter } from "../core";
import { AppContainer } from "../shared/AppContainer";

export function AddToHomeScreen(): JSX.Element {
  const icons = [
    {
      value: "/images/icons/zupass.png",
      label: "Zupass",
      icon: "/images/icons/zupass.png"
    },
    {
      value: "/images/icons/zuzalu.png",
      label: "Zuzalu",
      icon: "/images/icons/zuzalu.png"
    }
  ];
  const [icon, setIcon] = useState(icons[0]);

  return (
    <AppContainer bg="gray">
      <Helmet>
        <link rel="apple-touch-icon" href={icon.value} />
      </Helmet>
      <CenterColumn w={290}>
        <TextCenter>
          <Spacer h={64} />
          <H1>Add to Home Screen</H1>
          <p>
            Select an icon and use your browser’s “Add to Home Screen”
            functionality to install Zupass as a Progressive Web App (PWA).
          </p>
          <Select
            value={icon}
            onChange={setIcon}
            options={icons}
            components={{ Option: IconOption }}
          />
        </TextCenter>
      </CenterColumn>
    </AppContainer>
  );
}

const IconOption = ({ data, ...props }) => (
  <components.Option {...props}>
    <img src={data.icon} alt={data.label} width="20" height="20" />
    {data.label}
  </components.Option>
);
