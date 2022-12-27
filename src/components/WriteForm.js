import { useRef } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setLikeData, setPostData, setTitleInput } from "../store";

const WriteForm = () => {
    const dispatch = useDispatch();
    const postData = useSelector((state) => state.postData);
    const titleInput = useSelector((state) => state.titleInput);
    const likeData = useSelector((state) => state.likeData);

    const titleInputRef = useRef();
    const nextId = useRef(0);

    const writeNewPost = (input) => {
        if (input === "") {
            return titleInputRef.current.focus();
        }
        const tempPostData = [...postData];
        tempPostData.unshift({ id: nextId.current, title: input, content: "내용 없음", date: `${new Date()}` });
        dispatch(setPostData(tempPostData));
        dispatch(setTitleInput(""));

        const tempLikes = [...likeData];
        tempLikes.unshift({ id: nextId.current, like: 0 });
        dispatch(setLikeData(tempLikes));

        nextId.current++;
    };

    return (
        <Stack className="writeForm" direction="horizontal" gap={3}>
            <Form.Control
                className="me-auto"
                placeholder="글 제목을 입력해주세요"
                value={titleInput}
                onChange={(e) => dispatch(setTitleInput(e.target.value))}
                ref={titleInputRef}
                onKeyUp={() => window.event.keyCode === 13 && writeNewPost(titleInput)}
            />
            <Button className="writeButton" variant="secondary" onClick={() => writeNewPost(titleInput)}>
                글쓰기
            </Button>
        </Stack>
    );
};

export default WriteForm;
