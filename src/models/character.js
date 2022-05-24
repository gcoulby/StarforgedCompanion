class Character {
  name = "";
  selected = false;
  stats = [];
  maxMomentum = 10;
  resetMomentum = 2;
  totalExperience = 0;
  spentExperience = 0;
  debilities = [
    { name: "Wounded", type: "misfortunes", active: false },
    { name: "Shaken", type: "misfortunes", active: false },
    { name: "Unprepared", type: "misfortunes", active: false },
    { name: "Permanently Harmed", type: "lasting_effects", active: false },
    { name: "Traumatized", type: "lasting_effects", active: false },
    { name: "Doomed", type: "burdens", active: false },
    { name: "Tormented", type: "burdens", active: false },
    { name: "Indebted", type: "burdens", active: false },
    { name: "Battered", type: "current_vehicle", active: false },
    { name: "cursed", type: "current_vehicle", active: false },
  ];
  otherImpacts = [];
  progressions = [];
  background = [];
  vows = [];
  quests = [];
  companions = [];
  bonds = 0;
  goals = [];
  assets = [];
}

export default Character;
