import "./css/reset.css";
import "./css/App.scss";
import Button from "react-bootstrap/Button";
import { useEffect, useRef, useState } from "react";
import { Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { modifyPostData, plusLikeData, setLikeData, setPostData, setTitleInput } from "./store";

function App() {
    const dispatch = useDispatch();
    const postData = useSelector((state) => state.postData);
    const likeData = useSelector((state) => state.likeData);
    const [titleRenameInput, setTitleRenameInput] = useState("");
    const [modifyVisible, setModifyVisible] = useState(false);
    const [selectedPostIndex, setSelectedPostIndex] = useState(null);

    const plusLike = (index) => {
        const tempLikeData = [...likeData];
        console.log(index);
        dispatch(plusLikeData(index));
        dispatch(setLikeData(tempLikeData));
    };

    const deletePost = (index) => {
        const tempPostData = [...postData];
        tempPostData.splice(index, 1);
        dispatch(setPostData(tempPostData));
    };

    const openPostModify = (index) => {
        setTitleRenameInput(postData[index].title);
        setSelectedPostIndex(index);
        setModifyVisible(true);
    };

    const modifyPost = (index) => {
        console.log(index);
        dispatch(modifyPostData([index, titleRenameInput]));
        setModifyVisible(false);
    };

    useEffect(() => {
        console.log(postData);
        setModifyVisible(false);
    }, [postData]);

    return (
        <div className="App">
            <div className="container">
                <Stack gap={1}>
                    <WriteForm />
                    {postData.map((post, index) => {
                        return (
                            <div key={post.id} className="bg-light border post">
                                <div className={`modifyForm ${selectedPostIndex === index && modifyVisible && "visible"}`}>
                                    <Form.Control
                                        className="me-auto modifyBox"
                                        value={titleRenameInput}
                                        onChange={(e) => setTitleRenameInput(e.target.value)}
                                        onKeyUp={() => window.event.keyCode === 13 && modifyPost(index)}
                                    />
                                    <Button className="confirm" variant="outline-primary" onClick={() => modifyPost(index)}>
                                        <strong>확인</strong>
                                    </Button>
                                    <Button className="cancel" variant="outline-primary" onClick={() => setModifyVisible(false)}>
                                        <strong>취소</strong>
                                    </Button>
                                </div>
                                <div className="text" onClick={() => console.log(post)}>
                                    <strong>{post.title}</strong>
                                    <span>{post.content}</span>
                                </div>
                                <div className="buttonBox">
                                    <Button className="modify" variant="outline-primary" onClick={() => openPostModify(index)}>
                                        <strong>수정하기</strong>
                                    </Button>
                                    <Button className="delete" variant="outline-primary" onClick={() => deletePost(index)}>
                                        <strong>삭제하기</strong>
                                    </Button>
                                    <Button className="like" variant="outline-primary" onClick={() => plusLike(index)}>
                                        <strong>❤</strong>
                                        <span>{likeData[index].like}</span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Stack>
            </div>
        </div>
    );
}

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

// 글추가 순서
// 입력 값 저장할 titleState 만들기
// input value를 titleState와 같도록 설정하기
// setTitleState로 input value값으로 변화시키기
// input value가 비어있으면 입력창 포커스하기
// 데이터에 input value 추가하기
// input value 초기화하기

export default App;
