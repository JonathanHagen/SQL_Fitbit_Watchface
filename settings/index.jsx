const stringColorSet = [
{color: "#303030"},
{color: "grey"},
{color: "navy"},
{color: "#009aed"}, //blue
{color: "teal"},
{color: "seagreen"},
{color: "slateblue"},
{color: "khaki"},
{color: "coral"},
{color: "lightpink"},
{color: "red"},
{color: "crimson"}
];

const dateColorSet = [
{color: "blue"},
{color: "cyan"},
{color: "teal"},
{color: "seagreen"},
{color: "springgreen"},
{color: "slateblue"},
{color: "khaki"},
{color: "yellow"},
{color: "lemonchiffon"},
{color: "lightpink"},
{color: "#ff7645"}, //red
{color: "crimson"}
];

const numberColorSet = [
{color: "blue"},
{color: "#3BF7DE"}, //aqua
{color: "teal"},
{color: "seagreen"},
{color: "springgreen"},
{color: "slateblue"},
{color: "khaki"},
{color: "yellow"},
{color: "lemonchiffon"},
{color: "lightpink"},
{color: "#ff7645"}, //red
{color: "deeppink"}
];

function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Night Mode</Text>}>
        <Toggle
          settingsKey="toggleNightMode"
          label="Dims display 12AM-7AM"
        />
      </Section>
      
       <Section
        title={<Text bold align="center">Color (Select, Where, And)</Text>}>
        <ColorSelect
          settingsKey="stringColor"
          colors={stringColorSet}
        />
      </Section>
      
      <Section
        title={<Text bold align="center">Color (Date, Time, Mood, etc..)</Text>}>
        <ColorSelect
          settingsKey="dateColor"
          colors={dateColorSet}
        />
      </Section>
      
      <Section
        title={<Text bold align="center">Color (Steps, HR Active, HR Resting, etc..)</Text>}>
        <ColorSelect
          settingsKey="numberColor"
          colors={numberColorSet}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);