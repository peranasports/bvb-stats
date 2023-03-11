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

// var homeSideouts = [];
// var homeSideoutErrors = [];
// var homeSideoutFirstBalls = [];
// var homeSideoutTransitions = [];
// var homeSideoutOn2s = [];
// var homePoints = [];
// var homePlus = [];
// var homeMinus = [];
// var homePassAverage = [];
// var homeBlocks = [];
// var homeDigs = [];
// var homeAces = [];
// var homeServes = [];
// var awaySideouts = [];
// var awaySideoutErrors = [];
// var awaySideoutFirstBalls = [];
// var awaySideoutTransitions = [];
// var awaySideoutOn2s = [];
// var awayPoints = [];
// var awayPlus = [];
// var awayMinus = [];
// var awayPassAverage = [];
// var awayBlocks = [];
// var awayDigs = [];
// var awayAces = [];
// var awayServes = [];

export function ralliesForSet(d) {
  var events = d.events;
  var hsc = 0;
  var asc = 0;
  var lastevent = null;
  var rallies = [];
  var evs = [];
  for (var e of events) {
    var skill = e.eventType;
    if (
      skill === kSkillTimeout ||
      skill === kSkillTechTimeout ||
      skill === kSubstitution ||
      skill === kSkillCoachTag
    ) {
      continue;
    }
    var ehsc = e.teamScore;
    var easc = e.oppositionScore;
    if (ehsc !== hsc || easc !== asc) {
      var r = createRally(evs);
      rallies.push(r);
      evs = [];
    }
    evs.push(e);
    lastevent = e;
    hsc = ehsc;
    asc = easc;
  }
  if (evs.length > 0) {
    var r = createRally(evs);
    rallies.push(r);
    evs = [];
  }
  return rallies;
}

function createRally(evs) {
  var lastevent = evs[evs.length - 1];
  var r = {
    gameNumber: lastevent.game.gameNumber,
    homeScore: lastevent.teamScore,
    awayScore: lastevent.oppositionScore,
    blockEvents: [],
    spikeEvents: [],
    defenseEvents: [],
    oppEvents: [],
    oppBlockEvents: [],
    oppSpikeEvents: [],
    oppDefenseEvents: [],
  };
  r.events = evs;
  var prevevent;
  for (var ev of evs) {
    var skill = ev.eventType;
    var grade = ev.eventGrade;
    if (skill === kSkillServe) r.serveEvent = ev;
    else if (skill === kSkillPass) {
      r.passEvent = ev;
      if (grade === 0 && prevevent.eventType === kSkillOppositionServe) {
        prevevent.eventType = kOppositionServeAce;
        r.keyEvent = prevevent;
      }
    } else if (
      skill === kSkillSpike ||
      skill === kSkillOppositionSpike ||
      skill === kOppositionScore ||
      skill === kOppositionHitError
    ) {
      if (ev.isHomePossession) r.spikeEvents.push(ev);
      else r.oppSpikeEvents.push(ev);
    } else if (skill === kSkillBlock) {
      if (ev.isHomePossession) r.blockEvents.push(ev);
      else r.oppBlockEvents.push(ev);

      if (grade === 0 && prevevent.eventType === kSkillOppositionSpike) {
        prevevent.eventType = kOppositionScore;
        r.keyEvent = prevevent;
      }
    } else if (skill === kSkillDefense) {
      if (ev.isHomePossession) r.defenseEvents.push(ev);
      else r.oppDefenseEvents.push(ev);

      if (grade === 0 && prevevent.eventType === kSkillOppositionSpike) {
        prevevent.eventType = kOppositionScore;
        r.keyEvent = prevevent;
      }
    } else if (
      skill === kSkillOppositionServe ||
      skill === kOppositionServeAce ||
      skill === kOppositionServeError
    ) {
      r.serveEvent = ev;
    }
    if (grade === 0) {
      r.outcome = ev.isHomePossession ? 1 : 0;
      if (r.keyEvent === null) r.keyEvent = ev;
    } else if (
      grade === 3 &&
      skill !== kSkillPass &&
      skill !== kSkillDefense &&
      skill !== kSkillCover
    ) {
      r.outcome = ev.isHomePossession ? 0 : 1;
      if (r.keyEvent === null) r.keyEvent = ev;
    }
    if (
      skill === kOppositionScore ||
      skill === kOppositionHitKill ||
      skill === kOppositionServeAce
    ) {
      r.outcome = 1;
      r.keyEvent = ev;
    } else if (
      skill === kOppositionError ||
      skill === kOppositionHitError ||
      skill === kOppositionServeError
    ) {
      r.outcome = 0;
      r.keyEvent = ev;
    }
    prevevent = ev;
  }

  if (r.outcome === 0) {
    // team A won rally
    if (r.serveEvent.isAwayPossession) {
      r.sideout = true;
      r.sideoutFirstBall = true;
      for (var n = 1; n < r.events.length; n++) {
        var e = r.events[n];
        var grade = e.eventGrade;
        var skill = e.eventType;
        if (e.isAwayPossession) {
          if (grade !== 0) {
            r.sideoutFirstBall = false;
            break;
          }
        } else if (e.isHomePossession && skill === kSkillSpike && grade === 3) {
          r.sideoutSpikeKill = true;
          if (e.subEvent === 5) {
            r.sideoutOn2Kill = true;
          }
        }
      }
    }
  } // team B won rally
  else {
    if (r.serveEvent.isHomePossession) {
      r.sideout = true;
      r.sideoutFirstBall = true;
      for (var n = 1; n < r.events.length; n++) {
        var e = r.events[n];
        var grade = e.eventGrade;
        var skill = e.eventType;
        if (e.isHomePossession) {
          if (grade !== 0) {
            r.sideoutFirstBall = false;
            break;
          }
        } else if (e.isAwayPossession && skill === kSkillSpike && grade === 3) {
          r.sideoutSpikeKill = true;
          if (e.subEvent === 5) {
            r.sideoutOn2Kill = true;
          }
        }
      }
    }
  }
  return r;
}

export function calculateStatsForSet(d, match) {
  // var selAps = d.match.teamA === team ? teamAPlayersSelected : teamBPlayersSelected;
  // var selBps = d.match.teamA === team ? teamBPlayersSelected : teamAPlayersSelected;
  var selAps = match.teamA.players;
  var selBps = match.teamB.players;

  var rallies = ralliesForSet(d);

  var dic = doCalculateStatsForRallies(rallies, selAps, selBps, match);
  var sih = dic["HOME"];
  for (var pl of selAps) {
    var si = dic[pl.guid];
    si.gamesPlayed++;
    addStats(sih, si);
    si.PassAverage =
      si.PassTotal === 0
        ? 0
        : (si.Pass1 + si.Pass2 * 2 + si.Pass3 * 3 + si.Pass05 * 0.5) /
          si.PassTotal;
  }
  sih.PassAverage =
    sih.PassTotal === 0
      ? 0
      : (sih.Pass1 + sih.Pass2 * 2 + sih.Pass3 * 3 + sih.Pass05 * 0.5) /
        sih.PassTotal;

  var sia = dic["AWAY"];
  for (var pl of selBps) {
    var si = dic[pl.guid];
    si.gamesPlayed++;
    addStats(sia, si);
    si.PassAverage =
      si.PassTotal === 0
        ? 0
        : (si.Pass1 + si.Pass2 * 2 + si.Pass3 * 3 + si.Pass05 * 0.5) /
          si.PassTotal;
  }
  sia.PassAverage =
    sia.PassTotal === 0
      ? 0
      : (sia.Pass1 + sia.Pass2 * 2 + sia.Pass3 * 3 + sia.Pass05 * 0.5) /
        sia.PassTotal;
  return { homeStats: sih, awayStats: sia };
}

function doCalculateStatsForRallies(rallies, selAps, selBps, match) {
  var dic = {};
  var siHome = initStatsItem();
  siHome.Team = match.teamA;
  dic["HOME"] = siHome;
  for (const pl of selAps) {
    var si = initStatsItem();
    si.Player = pl;
    if (dic[pl.guid] === undefined) {
      dic[pl.guid] = si;
    }
  }
  var siAway = initStatsItem();
  siAway.Team = match.teamB;
  dic["AWAY"] = siAway;
  for (const pl of selBps) {
    var si = initStatsItem();
    si.Player = pl;
    if (dic[pl.guid] === undefined) {
      dic[pl.guid] = si;
    }
  }

  //    var sih = {};
  //    var sia = {};

  var hserve = 0;
  var aserve = 0;
  for (var r of rallies) {
    var drn = r.serveEvent.game.gameNumber.toString();
    // BeachStatsTimeOptionObject *obj = [statsTimeOptionObjects valueForKey:drn];
    // if (obj !== null && [obj testEvent:r.serveEvent] === false)
    // {
    //     continue;
    // }
    if (selAps.includes(r.serveEvent.player)) {
      // r.serveEvent.isHomePossession)
      var si =
        r.passEvent !== undefined ? dic[r.passEvent.player.guid] : siAway;
      hserve++;
      // var s = "Away #%d %d-%d S%@ - %@ ", hserve, r.homeScore, r.awayScore, r.serveEvent.game.gameNumber, r.serveEvent.player.NickName];
      // if (r.passEvent === undefined)
      // {
      //   continue
      // }
      if (
        (r.passEvent !== undefined && selBps.includes(r.passEvent.player)) ||
        r.serveEvent.eventGrade === 0 ||
        r.serveEvent.eventGrade === 3
      ) {
        if (r.serveEvent.eventGrade === 0 && selBps.length !== 2) {
        } else {
          si.SideoutTotal++;
        }
      } else {
        continue;
      }
      if (r.sideout) {
        if (r.serveEvent.eventGrade === 0 && selBps.length !== 2) {
        } else {
          si.SideOuts++;
          si.listSideouts.push(r);
          if (r.sideoutFirstBall) {
            si.SideOutFirstBalls++;
            si.listSideoutFirstBalls.push(r);
          }
          if (r.sideoutSpikeKill) {
            si.SideOutFirstBallKills++;
          }
          // [s appendFormat:@"Sideoout OK #%d", (int)si.SideOuts];
        }
      } else {
        if (r.serveEvent.eventGrade === 0 && selBps.length !== 2) {
        } else {
          si.SideOutFails++;
          if (r.serveEvent.eventGrade === 3) {
            si.SideOutFirstBallFails++;
          }
          var laste = r.events[r.events.length - 1];
          if (
            selBps.includes(laste.player) &&
            (laste.outcome === -1 || laste.isOppositionError) &&
            laste.isPointFive === false
          ) {
            si.listSideoutErrors.push(r);
            si.SideOutErrors++;
          }
          var thisserver = r.serveEvent.player;
          if (selAps.includes(thisserver)) {
            var sih = dic[r.serveEvent.player.guid];
            sih.BreakPoints++;
          }
          si.listPoints.push(r);
          // [s appendFormat:@"Sideoout Fail #%d", (int)si.SideOutFails];
        }
      }
      //            NSLog(@"%@", s);
    } else if (selBps.includes(r.serveEvent.player)) {
      // r.serveEvent.isAwayPossession)
      var si =
        r.passEvent !== undefined ? dic[r.passEvent.player.guid] : siHome;
      aserve++;
      // var s = [NSMutableString stringWithFormat:@"Home #%d %d-%d S%@ - %@ Serves ", aserve, r.homeScore, r.awayScore, r.serveEvent.game.gameNumber, r.serveEvent.player.NickName];
      // if (r.passEvent === undefined)
      // {
      //   continue
      // }
      if (
        (r.passEvent !== undefined && selAps.includes(r.passEvent.player)) ||
        r.serveEvent.eventGrade === 0 ||
        r.serveEvent.eventGrade === 3
      ) {
        if (r.serveEvent.eventGrade === 0 && selAps.length !== 2) {
        } else {
          si.SideoutTotal++;
        }
      } else {
        continue;
        //                NSLog(@"%@", r.keyEvent.player.NickName);
      }

      if (r.sideout) {
        if (r.serveEvent.eventGrade === 0 && selAps.length !== 2) {
        } else {
          si.SideOuts++;
          si.listSideouts.push(r);
          if (r.sideoutFirstBall) {
            si.SideOutFirstBalls++;
            si.listSideoutFirstBalls.push(r);
          }
          if (r.sideoutSpikeKill) {
            si.SideOutFirstBallKills++;
          }
          // [s appendFormat:@"- %@ Sideoout OK #%d", r.passEvent.player.NickName, (int)si.SideOuts];
        }
      } else {
        if (r.serveEvent.eventGrade === 0 && selAps.length !== 2) {
        } else {
          si.SideOutFails++;
          if (r.serveEvent.eventGrade === 3) {
            si.SideOutFirstBallFails++;
          }
          var laste = r.events[r.events.length - 1];
          if (
            selAps.includes(laste.player) &&
            laste.outcome === -1 &&
            laste.isPointFive === false
          ) {
            si.listSideoutErrors.push(r);
            si.SideOutErrors++;
          }
          var thisserver = r.serveEvent.player;
          if (selBps.includes(thisserver)) {
            var sia = dic[r.serveEvent.player.guid];
            sia.BreakPoints++;
          }
          si.listPoints.push(r);
          // [s appendFormat:@"- %@ Sideoout Fail #%d", r.passEvent.player.NickName, (int)si.SideOutFails];
        }
      }
      // NSLog(@"%@", s);
    }
  }
  for (var r of rallies) {
    var inFirstPhase = true;
    var eindex = 0;
    for (var ev of r.events) {
      eindex++;
      var skill = ev.eventType;
      var grade = ev.eventGrade;
      var et = ev.ErrorType;
      if (selAps.includes(ev.player)) {
        // ev.isHomePossession)
        var si = dic[ev.player.guid];
        if (selAps.length < 2 && selAps.includes(ev.player) === false) {
          continue;
        }
        if (skill === kSkillServe) {
          si.ServeTotal++;
          if (grade === 0) {
            si.Serve0++;
            si.listMinus.push(ev);
          } else if (grade === 1) si.Serve1++;
          else if (grade === 2) {
            si.Serve2++;
            si.listServes.push(ev);
          } else if (grade === 3) {
            si.Serve3++;
            si.listServes.push(ev);
            si.listAces.push(ev);
            si.listPlus.push(ev);
          }
        } else if (skill === kSkillPass) {
          si.PassTotal++;
          if (grade === 0) {
            if (et === 1) si.Pass05++;
            else si.Pass0++;
            si.listMinus.push(ev);
          } else if (grade === 1) si.Pass1++;
          else if (grade === 2) si.Pass2++;
          else if (grade === 3) si.Pass3++;
        } else if (skill === kSkillBlock) {
          inFirstPhase = false;
          if (grade === 0) {
            if (et === 1) si.Blck05++;
            else {
              si.Blck0++;
              si.listMinus.push(ev);
            }
          } else if (grade === 1) si.Blck1++;
          else if (grade === 2) si.Blck2++;
          else if (grade >= 3) {
            si.Blck3++;
            si.listBlocks.push(ev);
            si.listPlus.push(ev);
          }
        } else if (skill === kSkillSpike) {
          if (r.serveEvent.isHomePossession) {
            inFirstPhase = false;
          }
          si.SpikeTotal++;
          if (inFirstPhase === false) {
            si.TransSpikeTotal++;
          }
          if (grade === 0) {
            si.Spike0++;
            si.listMinus.push(ev);
            if (inFirstPhase === false) {
              si.TransSpike0++;
            }
          } else if (grade === 1) {
            si.Spike1++;
            if (inFirstPhase === false) {
              si.TransSpike1++;
            }
          } else if (grade === 2) {
            si.Spike2++;
            if (inFirstPhase === false) {
              si.TransSpike2++;
            }
          } else if (grade === 3) {
            si.Spike3++;
            if (inFirstPhase === false) {
              si.TransSpike3++;
            }
            si.listPlus.push(ev);
          }
          if (r.serveEvent.isAwayPossession) {
            if (inFirstPhase) {
              si.SideOutFirstBallSpikes++;
            }
            if (ev.subEvent === 5) {
              si.SideOutOn2s++;
              if (ev.eventGrade === 3) {
                si.SideOutOn2Kills++;
                si.listSideoutOn2s.push(r);
              }
            }
          }
        } else if (skill === kSkillDefense) {
          inFirstPhase = false;
          if (grade === 0) {
            if (et === 1) si.Dig05++;
            else {
              si.Dig0++;
              si.listMinus.push(ev);
            }
          } else if (grade === 1) {
            si.Dig1++;
            si.listDigs.push(ev);
          } else if (grade === 2) {
            si.Dig2++;
            si.listDigs.push(ev);
          } else if (grade === 3) {
            si.Dig3++;
            si.listDigs.push(ev);
          }
        }
      } else if (selBps.includes(ev.player)) {
        // ev.isAwayPossession)
        var si = dic[ev.player.guid];
        if (selBps.length < 2 && selBps.includes(ev.player) === false) {
          continue;
        }
        if (skill === kSkillServe) {
          si.ServeTotal++;
          if (grade === 0) {
            si.Serve0++;
            si.listMinus.push(ev);
          } else if (grade === 1) si.Serve1++;
          else if (grade === 2) {
            si.Serve2++;
            si.listServes.push(ev);
          } else if (grade === 3) {
            si.Serve3++;
            si.listServes.push(ev);
            si.listAces.push(ev);
            si.listPlus.push(ev);
          }
        } else if (skill === kSkillPass) {
          si.PassTotal++;
          if (grade === 0) {
            if (et === 1) si.Pass05++;
            else si.Pass0++;
            si.listMinus.push(ev);
          } else if (grade === 1) si.Pass1++;
          else if (grade === 2) si.Pass2++;
          else if (grade === 3) si.Pass3++;
        } else if (skill === kSkillBlock) {
          inFirstPhase = false;
          if (grade === 0) {
            if (et === 1) si.Blck05++;
            else {
              si.Blck0++;
              si.listMinus.push(ev);
            }
          } else if (grade === 1) si.Blck1++;
          else if (grade === 2) si.Blck2++;
          else if (grade >= 3) {
            si.Blck3++;
            si.listBlocks.push(ev);
            si.listPlus.push(ev);
          }
        } else if (skill === kSkillSpike) {
          if (r.serveEvent.isAwayPossession) {
            inFirstPhase = false;
          }
          si.SpikeTotal++;
          if (inFirstPhase === false) {
            si.TransSpikeTotal++;
          }
          if (grade === 0) {
            si.Spike0++;
            if (inFirstPhase === false) {
              si.TransSpike0++;
            }
            si.listMinus.push(ev);
          } else if (grade === 1) {
            si.Spike1++;
            if (inFirstPhase === false) {
              si.TransSpike1++;
            }
          } else if (grade === 2) {
            si.Spike2++;
            if (inFirstPhase === false) {
              si.TransSpike2++;
            }
          } else if (grade === 3) {
            si.Spike3++;
            if (inFirstPhase === false) {
              si.TransSpike3++;
            }
            si.listPlus.push(ev);
          }
          if (r.serveEvent.isHomePossession) {
            if (inFirstPhase) {
              si.SideOutFirstBallSpikes++;
            }
            if (ev.subEvent === 5) {
              si.SideOutOn2s++;
              if (ev.eventGrade === 3) {
                si.SideOutOn2Kills++;
                si.listSideoutOn2s.push(r);
              }
            }
          }
        } else if (skill === kSkillDefense) {
          inFirstPhase = false;
          if (grade === 0) {
            if (et === 1) si.Dig05++;
            else {
              si.Dig0++;
              si.listMinus.push(ev);
            }
          } else if (grade === 1) {
            si.Dig1++;
            si.listDigs.push(ev);
          } else if (grade === 2) {
            si.Dig2++;
            si.listDigs.push(ev);
          } else if (grade === 3) {
            si.Dig3++;
            si.listDigs.push(ev);
          }
        } else if (skill === kOppositionServeAce) {
          si.ServeTotal++;
          si.Serve3++;
          si.listPlus.push(ev);
          si.listServes.push(ev);
        } else if (skill === kOppositionServeError) {
          si.ServeTotal++;
          si.Serve0++;
          si.listMinus.push(ev);
        } else if (skill === kSkillOppositionServe) {
          si.ServeTotal++;
          var sgr = 2;
          var index = r.events.indexOf(ev);
          if (index !== -1) {
            if (index < r.events.length - 2) {
              var nextev = r.events[index + 1];
              if (nextev.isPassEvent) {
                var pgr = nextev.eventGrade;
                if (pgr === 3) sgr = 1;
              }
            }
          }
          if (sgr === 2) {
            si.Serve2++;
            si.listServes.push(ev);
          } else if (sgr === 1) si.Serve1++;
        } else if (skill === kOppositionScore) {
          si.SpikeTotal++;
          si.Spike3++;
          si.listPlus.push(ev);
        } else if (skill === kOppositionHitError) {
          si.SpikeTotal++;
          si.Spike0++;
          si.listMinus.push(ev);
        } else if (skill === kSkillOppositionSpike) {
          si.SpikeTotal++;
          si.Spike2++;
        }
      }
    }
  }

  for (const prop in dic) {
    var statsa = dic[prop];
    statsa.Plus = statsa.Serve3 + statsa.Spike3 + statsa.Blck3;
    statsa.Minus =
      statsa.Serve0 + statsa.Pass0 + statsa.Spike0 + statsa.Blck0 + statsa.Dig0;
    statsa.PositiveServe = statsa.Serve2 + statsa.Serve3 + statsa.Serve4;
    statsa.PassAverage =
      statsa.PassTotal === 0
        ? 0
        : (statsa.Pass1 +
            statsa.Pass2 * 2 +
            statsa.Pass3 * 3 +
            statsa.Pass05 * 0.5) /
          statsa.PassTotal;
  }

  return dic;
}

export function addStats(statsa, statsb) {
  statsa.Pass0 += statsb.Pass0;
  statsa.Pass05 += statsb.Pass05;
  statsa.Pass1 += statsb.Pass1;
  statsa.Pass2 += statsb.Pass2;
  statsa.Pass3 += statsb.Pass3;
  statsa.PassTotal += statsb.PassTotal;
  statsa.Serve0 += statsb.Serve0;
  statsa.Serve1 += statsb.Serve1;
  statsa.Serve2 += statsb.Serve2;
  statsa.Serve3 += statsb.Serve3;
  statsa.Serve4 += statsb.Serve4;
  statsa.ServeTotal += statsb.ServeTotal;
  statsa.ServeTotalSpeed += statsb.ServeTotalSpeed;
  statsa.Set0 += statsb.Set0;
  statsa.Set1 += statsb.Set1;
  statsa.Set2 += statsb.Set2;
  statsa.Set3 += statsb.Set3;
  statsa.Spike0 += statsb.Spike0;
  statsa.Spike1 += statsb.Spike1;
  statsa.Spike2 += statsb.Spike2;
  statsa.Spike3 += statsb.Spike3;
  statsa.SpikeTotal += statsb.SpikeTotal;
  statsa.SpikeBlocked += statsb.SpikeBlocked;
  statsa.Blck0 += statsb.Blck0;
  statsa.Blck1 += statsb.Blck1;
  statsa.Blck2 += statsb.Blck2;
  statsa.Blck3 += statsb.Blck3;
  statsa.Blck4 += statsb.Blck4;
  statsa.BlckSolo += statsb.BlckSolo;
  statsa.BlckAssist += statsb.BlckAssist;
  statsa.BHE += statsb.BHE;
  statsa.Dig += statsb.Dig;
  statsa.Dig0 += statsb.Dig0;
  statsa.Dig1 += statsb.Dig1;
  statsa.Dig2 += statsb.Dig2;
  statsa.Dig3 += statsb.Dig3;
  statsa.SetDuration += statsb.SetDuration;
  statsa.playTime += statsb.playTime;
  statsa.gamesPlayed += statsb.gamesPlayed;
  statsa.SideOuts += statsb.SideOuts;
  statsa.SideOutFails += statsb.SideOutFails;
  statsa.SideOutFirstBallFails += statsb.SideOutFirstBallFails;
  statsa.BreakPoints += statsb.BreakPoints;
  statsa.SideOutFirstBalls += statsb.SideOutFirstBalls;
  statsa.OppServeError += statsb.OppServeError;
  statsa.SideoutTotal += statsb.SideoutTotal;
  statsa.SideOutFirstBallKills += statsb.SideOutFirstBallKills;
  statsa.SideOutOn2s += statsb.SideOutOn2s;
  statsa.SideOutOn2Kills += statsb.SideOutOn2Kills;
  statsa.SideOutErrors += statsb.SideOutErrors;
  statsa.Plus += statsb.Plus;
  statsa.Minus += statsb.Minus;
  statsa.PositiveServe += statsb.PositiveServe;
  statsa.PassAverage =
    statsa.PassTotal === 0
      ? 0
      : (statsa.Pass1 +
          statsa.Pass2 * 2 +
          statsa.Pass3 * 3 +
          statsa.Pass05 * 0.5) /
        statsa.PassTotal;
  statsa.Points += statsb.Points;
  statsa.PointsLost += statsb.PointsLost;

  statsa.listSideouts.push(...statsb.listSideouts)
  statsa.listSideoutErrors.push(...statsb.listSideoutErrors)
  statsa.listSideoutFirstBalls.push(...statsb.listSideoutFirstBalls)
  statsa.listSideoutTransitions.push(...statsb.listSideoutTransitions)
  statsa.listSideoutOn2s.push(...statsb.listSideoutOn2s)
  statsa.listPoints.push(...statsb.listPoints)
  statsa.listPlus.push(...statsb.listPlus)
  statsa.listMinus.push(...statsb.listMinus)
  statsa.listPassAverage.push(...statsb.listPassAverage)
  statsa.listBlocks.push(...statsb.listBlocks)
  statsa.listDigs.push(...statsb.listDigs)
  statsa.listAces.push(...statsb.listAces)
  statsa.listServes.push(...statsb.listServes)
}

export function initStatsItem() {
  return {
    // TrainingSession: match,
    // Drill:game,
    Player: null,
    Team: null,
    Pass0: 0,
    Pass05: 0,
    Pass1: 0,
    Pass2: 0,
    Pass3: 0,
    PassTotal: 0,
    Serve0: 0,
    Serve1: 0,
    Serve2: 0,
    Serve3: 0,
    Serve4: 0,
    ServeTotal: 0,
    ServeTotalSpeed: 0,
    Set0: 0,
    Set1: 0,
    Set2: 0,
    Set3: 0,
    Spike0: 0,
    Spike1: 0,
    Spike2: 0,
    Spike3: 0,
    SpikeTotal: 0,
    SpikeBlocked: 0,
    Blck0: 0,
    Blck1: 0,
    Blck2: 0,
    Blck3: 0,
    Blck4: 0,
    BlckSolo: 0,
    BlckAssist: 0,
    BHE: 0,
    Dig: 0,
    Dig0: 0,
    Dig1: 0,
    Dig2: 0,
    Dig3: 0,
    GameNumber: 0,
    PlayerName: "",
    PlayerShirtNumber: "",
    Score1: "",
    Score2: "",
    Score3: "",
    Score4: "",
    SetDuration: 0,
    playTime: 0,
    gamesPlayed: 0,
    SideOuts: 0,
    SideOutFails: 0,
    SideOutFirstBallFails: 0,
    BreakPoints: 0,
    SideOutFirstBalls: 0,
    OppServeError: 0,
    SideoutTotal: 0,
    SideOutFirstBallKills: 0,
    SideOutOn2s: 0,
    SideOutOn2Kills: 0,
    SideOutErrors: 0,

    PassAverage: 0,
    DigAverage: 0,
    ServeAverage: 0,
    ServeEfficiency: 0,
    SetAverage: 0,
    HitAverage: 0,
    BlockAverage: 0,
    PassPercentPerfect: 0,
    SpikeEfficiency: 0,
    SpikeKillPercentage: 0,
    Points: 0,
    PointsLost: 0,
    Plus: 0,
    Minus: 0,
    PositiveServe: 0,

    ServeOverallStatus: 0,
    PassOverallStatus: 0,
    DigOverallStatus: 0,
    HitOverallStatus: 0,
    BlockOverallStatus: 0,

    Starts: [],

    listSideouts: [],
    listSideoutErrors: [],
    listSideoutFirstBalls: [],
    listSideoutTransitions: [],
    listSideoutOn2s: [],
    listPoints: [],
    listPlus: [],
    listMinus: [],
    listPassAverage: [],
    listBlocks: [],
    listDigs: [],
    listAces: [],
    listServes: [],
  };
}
