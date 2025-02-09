import { Chase, ChaseMetaData } from '../chase';
import { Description } from '../description';
import { GameElement } from '../game_element';
import { Image, ImageFile } from '../media';
import { Narrative } from '../narrative';
import { Quest, QuestType } from '../quest';
import { Preview } from '../preview';
import { RequirementCombination } from '../requirement_combination';
import { LogicType, SolutionTerm } from '../solution_term';
import { XButton } from '../x_button';
import { base64_encoded_image } from './image_example';

export function getSimpleExample(): Chase {
  const chase = new Chase();
  const metaData = new ChaseMetaData();
  metaData.chaseId = 'simple_id';
  metaData.title = 'This is an example chase!';
  metaData.preview = new Description()
  metaData.preview.text = 'This chase has no content';
  chase.metaData = metaData;
  chase.gameElements = new Map<number, GameElement>();
  const image = new Image();
  image.files = [new ImageFile('https://upload.wikimedia.org/wikipedia/en/b/b4/Hitchhikers_Guide_TV_Titles.jpg', 0)];
  chase.media.set('image_id', image);

  const narrative = new Narrative();
  narrative.title = 'Error occured!';
  narrative.description = new Description();
  narrative.description.text = 'If you can see this, something went wrong.';
  narrative.description.image = 'image_id';
  const forward = new XButton();
  forward.name = 'stay';
  forward.destination = 0;
  narrative.buttons = new Array<XButton>();
  narrative.buttons.push(forward);
  chase.gameElements.set(0,narrative);
  chase.initialGameElement = 0;

  return chase;
}

export function getTestChase(): Chase {
  const chase = new Chase();
  const metaData = new ChaseMetaData();
  metaData.chaseId = 'simple_id';
  metaData.title = 'This is an example chase!';
  metaData.preview = new Description()
  metaData.preview.text = 'This chase has no content';
  metaData.preview.image = 'simple_image';
  metaData.author = new Description()
  metaData.author.text = 'author';
  metaData.author.image = 'author_image';
  chase.metaData = metaData;
  chase.gameElements = new Map<number, GameElement>();

  const narrative = new Narrative();
  narrative.title = 'narrative_title';
  narrative.description = new Description();
  narrative.description.text = 'Some text!';
  narrative.description.image = 'simple_image';
  narrative.media = 'narrative_media';
  const forward = new XButton();
  forward.name = 'continue';
  forward.destination = 1;
  narrative.buttons = new Array<XButton>();
  narrative.buttons.push(forward);
  chase.gameElements.set(0,narrative);

  chase.initialGameElement = 0;

  const quest = new Quest();
  quest.title = 'quest_title';
  quest.description = new Description();
  quest.description.text = 'Some text!';
  quest.description.image = 'quest_image';
  chase.gameElements.set(1,quest);

  return chase;
}
