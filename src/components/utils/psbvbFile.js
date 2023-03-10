import { unzipBuffer, uncapitalizeFirstLetter, uuidv4 } from "./utils";

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

function JSONparse(str)
{
    return JSON.parse(str, function(prop, value) {
        var lower = uncapitalizeFirstLetter(prop);
        if (prop === lower) return value;
        else this[lower] = value;
      });
}

export function initWithZippedBuffer(zippeddata)
{
    const data = unzipBuffer(zippeddata)

    const lines = data.split("\r\n")
    // console.log(lines)

    var players = {}
    var homeplayers = []
    var match = null
    var currentgame = null
    for (const line of lines)
    {
        // const tokens = line.split("~")
        const first2 = line.substring(0, 2)
        const first3 = line.substring(0, 3)
        const len2 = line.substring(2, line.length)
        const len3 = line.substring(3, line.length)
        if (first2 === "M~")
        {
            // match = JSONparse(len3)            
            match = JSONparse(len2)
            if (match.guid === undefined)
            {
                match.guid = uuidv4()
            }
            if (match.videoStartTime === undefined || match.videoStartTime.substring(0, 4) === "0001")
            {
                match.videoStartTime = "1970-01-01T00:00:00.000Z"
            }
            match.games = []
            match.videos = []
        }
        else if (first3 === "TO~")
        {
            if (len3 !== "(null)")
            {
                var tom = JSONparse(len3)
                match.tournament = tom
            }
            else
            {
                match.tournament = {Name: "UNKNOWN"}
            }
        }
        else if (first3 === "VE~")
        {
            if (len3 !== "(null)")
            {
                var ven = JSONparse(len3)
                match.venue = ven
            }
            else
            {
                match.venue = {Name: "UNKNOWN"}
            }
        }
        else if (first3 === "TH~")
        {
            match.teamA = JSONparse(len3)
            match.teamA.countryCode = match.teamA.name.substring(0,3)
            match.teamA.players = []
        }
        else if (first3 === "TA~")
        {
            match.teamB = JSONparse(len3)
            match.teamB.countryCode = match.teamB.name.substring(0,3)
            match.teamB.players = []
        }
        else if (first2 === "V~")
        {
            if (len2 !== "(null)")
            {
                var vid = JSONparse(len2)    
                match.videos.push(vid)
            }
            else
            {
                match.videos.push({name: "UNKNOWN"})
            }
        }
        else if (first3 === "PH~")
        {
            var pla = JSONparse(len3)
            players[pla.guid] = pla
            match.teamA.players.push(pla)
            homeplayers.push(pla)
        }
        else if (first3 === "PA~")
        {
            var plb = JSONparse(len3)
            players[plb.guid] = plb
            match.teamB.players.push(plb)
        }
        else if (first2 === "Q~")
        {
            currentgame = JSONparse(len2)
            currentgame.events = []
            match.games.push(currentgame)
        }
        else if (first2 === "E~")
        {
            const e = JSONparse(len2)            
            e.player = players[e.playerGuid]
            e.isHome = match.teamA.players.includes(e.player)
            e.game = currentgame
            e.timeStamp = new Date(e.timeStamp)
            e.isAwayPossession = homeplayers.includes(e.player) === false
            e.isHomePossession = homeplayers.includes(e.player)
            e.outcome = eventOutcome(e)
            e.isOppositionError = (e.eventGrade === kOppositionError || e.eventGrade === kOppositionHitError || e.eventGrade === kOppositionServeError)
            e.isPointFive = (e.eventGrade === 0 && e.errorType === 1)
            currentgame.events.push(e)
        }
    }
    return match
}

function eventOutcome(e)
{
    var et = e.eventType;
    var grade = e.eventGrade;
    var err = e.errorType;
    if (et == kOppositionError || et == kOppositionHitError || et == kOppositionServeError)
    {
        return 1;
    }
    if (et == kOppositionScore || et == kOppositionHitKill || et == kOppositionServeAce)
    {
        return -1;
    }
    if (grade == 0 && et == kSkillSpike)
    {
        return -1;
    }
    if (grade == 0 && et <= kSkillFreeball && err == 0)
    {
        return -1;
    }
    if (grade == 2 && et == kSkillBlock) // block solo
    {
        return 1;
    }
    if (grade == 3 && et == kSkillBlock) // block assist
    {
        return 2;
    }
    if (grade == 3 && et != kSkillPass)
    {
        return 1;
    }
    
    return 0;
}
