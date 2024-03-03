import { useState } from "react";
import { Helmet } from "react-helmet";
import Select, { components } from "react-select";
import { CenterColumn, H2, Spacer, TextCenter } from "../core";
import { AppContainer } from "../shared/AppContainer";
import { ScreenNavigation } from "../shared/ScreenNavigation";

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
    },
    {
      value: "/images/icons/vitalia.png",
      label: "Vitalia",
      icon: "/images/icons/vitalia.png"
    },
    {
      value: "/images/icons/edgecitydenver.png",
      label: "Edge City Denver",
      icon: "/images/icons/edgecitydenver.png"
    },
    {
      value: "/images/icons/frogcrypto.png",
      label: "FrogCrypto",
      icon: "/images/icons/frogcrypto.png"
    }
  ];
  const [icon, setIcon] = useState(icons[0]);

  return (
    <AppContainer bg="gray">
      <ScreenNavigation label={"Home"} to="/" />
      <Helmet>
        <link rel="apple-touch-icon" href={icon.value} />
      </Helmet>
      <CenterColumn w={290}>
        <TextCenter>
          <Spacer h={64} />
          <H2>Add to Home Screen</H2>
          <Spacer h={16} />
          <Select
            value={icon}
            onChange={setIcon}
            options={icons}
            components={{ Option: IconOption, SingleValue }}
          />
          <Spacer h={16} />
          <ol style={{ textAlign: "left" }}>
            <li>Choose an icon</li>
            <li>Tap the Share button</li>
            <li>Tap Add to Home Screen</li>
            <li>Enjoy a more native Zupass experience</li>
          </ol>
        </TextCenter>
        <Spacer h={16} />
        <img
          style={{
            display: "block",
            textAlign: "center",
            margin: "0 auto",
            borderRadius: "12px"
          }}
          src={icon.value}
          alt={icon.label}
          width="64"
          height="64"
        />
      </CenterColumn>
    </AppContainer>
  );
}

const IconOption = ({ data, ...props }) => (
  <components.Option {...props}>
    <div>
      <img
        src={data.icon}
        alt={data.label}
        width="20"
        height="20"
        style={{ borderRadius: "3px" }}
      />
      <span
        style={{
          color: "#19473f",
          marginLeft: "10px",
          display: "inline-block"
        }}
      >
        {data.label}
      </span>
    </div>
  </components.Option>
);

const SingleValue = ({ data, ...props }) => (
  <components.SingleValue {...props}>
    <div>
      <img
        src={data.icon}
        alt={data.label}
        width="20"
        height="20"
        style={{ borderRadius: "3px" }}
      />
      <span
        style={{
          color: "#19473f",
          marginLeft: "10px",
          display: "inline-block"
        }}
      >
        {data.label}
      </span>
    </div>
  </components.SingleValue>
);
