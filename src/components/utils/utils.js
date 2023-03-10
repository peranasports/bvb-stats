export function unzipBuffer(inputstr) {
  if (inputstr === undefined || inputstr.length === 0) {
    return null;
  }
  // console.log('unzipBuffer buffer length', inputstr.length)
  const pako = require("pako");
  var b64Data = inputstr;
  try {
    var strData = window.atob(b64Data);
  } catch (error) {
    return inputstr;
  }
  var len = strData.length;
  var bytes = new Uint8Array(len);
  var j = 0;
  for (var i = 4; i < len; i++) {
    bytes[j] = strData.charCodeAt(i);
    j++;
  }
  var binData = new Uint8Array(bytes);
  try {
    var buffer = pako.inflate(binData, { to: "string" });
  } catch (error) {
    // console.log('inflate', error)
    return null;
  }
  return buffer;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function uncapitalizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export function eventString(e) {
  const kSkillServe = 1;
  const kSkillPass = 2;
  const kSkillSet = 3;
  const kSkillSpike = 4;
  const kSkillBlock = 5;
  const kSkillDefense = 6;
  const kSkillFreeball = 7;
  const kSkillCover = 7;
  const kSkillCoachTag = 8;
  const kSkillEndOfSet = 9;
  const kSkillTransitionSO = 10;
  const kSkillTransitionPoconst = 11;
  const kSkillPointWonServe = 12;
  const kSkillPointLostServe = 13;
  const kSkillPointWonReceive = 14;
  const kSkillPointLostReceive = 15;
  const kSkilliCodaAttack = 16;
  const kSkilliCodaDefense = 17;
  const kSkillCodeError = 18;
  const kSkillOppositionError = 19;
  const kSkillSettersCall = 20;
  const kSkillSpeedServe = 30;
  const kSkillUnknown = 40;
  const kOppositionScore = 100;
  const kOppositionError = 101;
  const kOppositionHitKill = 102;
  const kOppositionHitError = 103;
  const kOppositionServeError = 104;
  const kOppositionServeAce = 105;
  const kSkillCommentary = 200;
  const kSkillTimeout = 201;
  const kSkillTechTimeout = 202;
  const kSubstitution = 250;
  const kSkillOppositionServe = 401;
  const kSkillOppositionSpike = 404;

  switch (e.eventType) {
    case 1:
      return "Serve";
    case 2:
      return "Pass";
    case 3:
      return "Set";
    case 4:
      return "Spike";
    case 5:
      return "Block";
    case 6:
      return "Dig";
    case 7:
      return "Cover";
    case kSkillUnknown:
      return "Unknown";
    case kSkillCoachTag:
      return "Coach Tag";
    case 9:
      return "End of Set";
    case 10:
      return "Transition SO";
    case 11:
      return "Transition Point";
    case 12:
      return "Poconst Won on Serve";
    case 13:
      return "Poconst Lost on Serve";
    case 14:
      return "Poconst Won on Receive";
    case 15:
      return "Poconst Lost on Receive";
    case 16:
      return "Attack";
    case 17:
      return "Defence";
    case 18:
      return "Code Error";
    case 19:
      return "Opposition Error";
    case kOppositionScore:
      return "Opposition Score";
    case kOppositionError:
      return "Opposition Error";
    case kOppositionServeError:
      return "Opposition Serve Error";
    case kOppositionHitError:
      return "Opposition Hit Error";
    case kOppositionServeAce:
      return "Opposition Serve Ace";
    case kOppositionHitKill:
      return "Opposition Kill";
    case kSkillCommentary:
      return "Commentary";
    case kSkillTimeout:
      return "Timeout";
    case kSkillTechTimeout:
      return "Technical Timeout";
    case kSubstitution:
      return "Substitution";
    case 251:
      return "Substitution";
    case kSkillOppositionServe:
      return "Opposition Serve";
    case kSkillOppositionSpike:
      return "Opposition Spike";
  }
  return "";
}

export function dateToString(dt)
{
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    return zeroPad(dt.getDate(), 2) + "/"  + zeroPad((dt.getMonth() + 1), 2) + "/" + dt.getFullYear().toString();
}

export function eventGradeString(e) {
  const eg = e.eventGrade;
  if (e.isPointFive) {
    return "0.5";
  }
  return e.eventGrade.toString();
}

export function subEventString(e, m) {
  const kSkillTimeout = 201;
  const kSkillTechTimeout = 202;

  if (e.subEvent === null || e.subEvent === 0) {
    return "";
  }
  var s = "";
  const ev = e.eventType;
  const se = e.subEvent - 1;
  const se2 = e.subEvent2 - 1;
  const bsServes = ["Jump", "Jump Float", "Float", "Skyball"];
  const bsPasses = ["Jump", "Jump Float", "Float", "Skyball"];
  const bsSpikes = ["Power", "Shot", "Freeball", "Poke", "On2", "Flat"];
  const bsBlocks = ["Power", "Shot", "Freeball", "Poke", "On2", "Flat"];
  const bsDigs = ["Power", "Shot", "Freeball", "Poke", "On2", "Flat"];
  const bsSets = ["Over Set", "Double", "Lift", "Net Touch", "Error"];
  const bsTimeouts = ["Technical", "Medical", "Team", "Opposition"];

  if (ev === 1) {
    // serve
    if (se < bsServes.length) {
      s += bsServes[se];
    }
  } else if (ev === 2) {
    // pass
    s += bsPasses[se];
  } else if (ev === 3) {
    // set
    if (se < bsSets.length && e.eventGrade === 0) {
      s += bsSets[se];
    }
  } else if (ev === 4) {
    // hit
    if (se < bsSpikes.length) {
      s += bsSpikes[se];
    }
  }
  if (ev === 5) {
    // block
    if (se < bsBlocks.length) {
      s += bsBlocks[se];
    }
  } else if (ev === 6) {
    // dig
    if (se < bsDigs.length) {
      s += bsDigs[se];
      if (se2 > 2) {
        s += " Drop";
      }
      s += ")";
    }
  } else if (ev === kSkillTimeout) {
    // timeout
    se = e.subEvent - 1;
    if (se === 2) {
      const tm = m.teamA;
      s += tm.code;
    } else if (se === 3) {
      const tm = m.teamB;
      s += tm.code;
    } else {
      s += bsTimeouts[se];
    }
  } else if (ev === kSkillTechTimeout) {
    // timeout
    s += "Technical";
  }
  return s;
}
