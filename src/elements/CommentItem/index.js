import { createState } from 'solid-js';
import { customElement, useContext } from 'solid-element';

import Store from '../../Store';
import { relativeTime } from '../../lib/format';
import style from './style.css';

const CommentItem = ({ commentId }) => {
  const [state, setState] = createState({ hidden: false }),
    watch = useContext(Store);

  watch(
    {name: 'story', id: commentId},
    comment => setState({ comment })
  );

  return <>
    <style>{style}</style>
    <$ when={state.comment && !state.comment.deleted && !state.comment.dead && state.comment.text}>
      <div class="header light">
        <a is="route-link" name="user" params={{userId: state.comment.by}}>{state.comment.by}</a> 
        <a is="route-link" name="story" params={{storyId: state.comment.id}}>{relativeTime(state.comment.time*1000)}</a>
        <a onClick={() => setState('hidden', h => !h)} >{(state.hidden ? '[+]' : '[-]')}</a>
      </div>
      <div hidden={(state.hidden)}>
        <div class='body' innerHTML={state.comment.text || ''} />
        <ul><$ each={state.comment.kids}>{childCommentId =>
          <li><comment-item commentId={childCommentId} /></li>
        }</$></ul>
      </div>
    </$>
  </>
};

export default customElement('comment-item', {commentId: 0}, CommentItem);
