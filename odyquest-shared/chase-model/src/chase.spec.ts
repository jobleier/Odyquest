import {Chase} from './chase';
import {Narrative} from './narrative';
import {Quest} from './quest';
import {getTestChase} from './example/chase_example';

describe('Chase', () => {
  let chase = getTestChase();

  beforeEach(() => {
  });

  it('should have element access', () => {
    expect(chase.getElement(0) instanceof Narrative).toBeTruthy();
    expect((chase.getElement(0) as Narrative).title).toEqual('narrative_title');
    expect(chase.getElement(1) instanceof Quest).toBeTruthy();
    expect((chase.getElement(1) as Quest).title).toEqual('quest_title');
  });
  it('should find image usage in narrative', () => {
    const list = chase.findUsagesOfMediaInGameElements('simple_image');
    expect(list.length).toEqual(1);
  });
  it('should find media usage in narrative', () => {
    const list = chase.findUsagesOfMediaInGameElements('narrative_media');
    expect(list.length).toEqual(1);
  });
  it('should list image usage in quest', () => {
    const list = chase.usagesOfMediaInGameElements('quest_image');
    expect(list.length).toEqual(1);
  });
  it('should list image usage in meta data description', () => {
    const list = chase.usagesOfMediaInMetaData('simple_image');
    expect(list.length).toEqual(1);
  });
  it('should list image usage in meta data author', () => {
    const list = chase.usagesOfMediaInMetaData('author_image');
    expect(list.length).toEqual(1);
  });
  it('should list media usage in multiple places', () => {
    const list = chase.usagesOfMedia('simple_image');
    expect(list.length).toEqual(2);
  });
});
