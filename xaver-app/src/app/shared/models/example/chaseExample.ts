import { Chase, ChaseMetaData } from '../chase';
import { Description } from '../description';
import { GameElement } from '../gameElement';
import { Narrative } from '../narrative';
import { Quest, QuestType } from '../quest';
import { RequirementCombination } from '../requirementCombination';
import { LogicType, SolutionTerm } from '../solution_term';
import { XButton } from '../xButton';
import { base64_encoded_image } from './imageExample';

export function getSimpleExample(): Chase {
  const chase = new Chase();
  const metaData = new ChaseMetaData();
  metaData.title = 'This is an example chase!';
  metaData.description = 'This chase has no content';
  chase.metaData = metaData;
  chase.gameElements = new Map<number, GameElement>();

  const narrative = new Narrative();
  narrative.title = 'Error occured!';
  narrative.description = new Description();
  narrative.description.text = 'If you can see this, something went wrong.';
  narrative.description.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  const forward = new XButton();
  forward.name = 'stay';
  forward.destination = 0;
  narrative.buttons = new Array<XButton>();
  narrative.buttons.push(forward);
  chase.gameElements[0] = narrative;
  chase.initialGameElement = 0;

  return chase;
}

export function getExample(): Chase {
  const chase = new Chase();
  const metaData = new ChaseMetaData();
  metaData.title = 'This is a chase to the galaxy';
  metaData.description = 'Description of the galaxy chase!';
  chase.metaData = metaData;
  chase.gameElements = new Map<number, GameElement>();

  const narrative = new Narrative();
  narrative.title = 'Hitchhiking to the galaxy';
  narrative.description = new Description();
  narrative.description.text = 'You have the opportunity to travel though the galaxy. According to your guide the spaceship Heart of Gold is enabled with an Infinite Improbability Drive. Your guide also tells you "Don\'t panic"!';
  narrative.description.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  const forward = new XButton();
  forward.name = 'Enter the Heart of Gold';
  forward.destination = 1;
  narrative.buttons = new Array<XButton>();
  narrative.buttons.push(forward);
  chase.gameElements[0] = narrative;
  chase.initialGameElement = 0;

  const quest = new Quest();
  quest.title = 'The Ultimate Question';
  quest.description = new Description();
  quest.description.text = 'What is the answer to the Ultimate Question to Life, the Universe, and Everything?';
  quest.description.image = base64_encoded_image;
  quest.questType = QuestType.MultipleChoice;
  // quest.questType = QuestType.Text;
  quest.maxTries = 7;
  // quest.maxTime = something like 42 minutes
  const combination = new RequirementCombination();
  combination.solutionItems = ['three', 'fortytwo'];
  const right = new Solution();
  right.requiredItems = [false, true];
  right.logicType = LogicType.And;
  right.description = new Description();
  right.description.text = 'You are right, according to Deep Thought it is 42!';
  right.description.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  right.destination = 0;
  const wrong = new Solution();
  wrong.requiredItems = [true, false];
  wrong.logicType = LogicType.And;
  wrong.description = new Description();
  wrong.description.text = 'You loose!';
  wrong.description.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  wrong.destination = 1;
  combination.combinationMap = [right, wrong];
  quest.requirementCombination = combination;

  const firstHelp = new Description();
  firstHelp.text = 'It is 42!';
  firstHelp.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  const secondHelp = new Description();
  secondHelp.text = 'Not 3!';
  secondHelp.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  const thirdHelp = new Description();
  thirdHelp.text = 'Type letters instead of numbers';
  thirdHelp.image = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg';
  quest.help = [firstHelp, secondHelp];

  chase.gameElements[1] = quest;

  return chase;
}
