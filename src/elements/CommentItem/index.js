import { createState } from "solid-js";
import { customElement } from "solid-element";

import { useStore } from "../../Store";
import { relativeTime } from "../../lib/format";
import style from "./style.css";

const CommentItem = ({ commentId }) => {
  const [state, setState] = createState({ hidden: false }),
    { getItem } = useStore();

  getItem(commentId).then(comment => setState({ comment }));

  return (
    <>
      <style>{style}</style>
      <Show
        when={
          state.comment &&
          !state.comment.deleted &&
          !state.comment.dead &&
          state.comment.text
        }
      >
        <div class="header light">
          <a is="route-link" name="user" prop:params={{ userId: state.comment.by }}>
            {state.comment.by}
          </a>{" "}
          <a
            is="route-link"
            name="story"
            prop:params={{ storyId: state.comment.id }}
          >
            {relativeTime(state.comment.time * 1000)}
          </a>
          <a onClick={() => setState("hidden", h => !h)}>
            {state.hidden ? "[+]" : "[-]"}
          </a>
        </div>
        <div hidden={state.hidden}>
          <div class="body" innerHTML={state.comment.text || ""} />
          <ul>
            <For each={state.comment.kids}>
              {childCommentId => (
                <li>
                  <comment-item comment-id={childCommentId} />
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </>
  );
};

export default customElement("comment-item", { commentId: 0 }, CommentItem);
