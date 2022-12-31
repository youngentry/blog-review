import { useEffect, useRef, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../store";
import "../css/WriteForm.scss";

const WriteForm = () => {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postData);

  const [isContentInputVisible, setIsContentInputVisible] = useState(false);
  const writeFromRef = useRef();

  const [titleInput, setTitleInput] = useState("");
  const titleInputRef = useRef();
  const [contentInput, setContentInput] = useState("");
  const contentInputRef = useRef();
  const nextId = useRef(postData[0].id + 1);

  // 글 제목, 글 내용 입력하고 엔터하거나 글쓰기 버튼 클릭하면 게시물 추가
  const writeNewPost = (input) => {
    if (input === "") {
      return titleInputRef.current.focus();
    }
    if (contentInput === "") {
      setIsContentInputVisible(true);
      return contentInputRef.current.focus();
    }
    setTitleInput("");
    setContentInput("");
    const tempPostData = [...postData];
    tempPostData.unshift({ id: nextId.current++, title: input, content: contentInput, like: 0, date: `${new Date()}` });
    dispatch(setPostData(tempPostData));
  };

  useEffect(() => {
    // 모달이 열려 있고 모달의 바깥쪽을 눌렀을 때 창 닫기
    const clickOutside = (e) => {
      if (isContentInputVisible && !writeFromRef.current.contains(e.target)) {
        setIsContentInputVisible(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [isContentInputVisible]);

  return (
    <>
      <Stack className="writeForm" direction="horizontal" onClick={() => setIsContentInputVisible(true)} ref={writeFromRef}>
        <Form.Control className="me-auto titleInput" placeholder="글 제목을 입력해주세요" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} ref={titleInputRef} />
        <Form.Control
          className={`contentInput ${isContentInputVisible && "visible"}`}
          as="textarea"
          rows={3}
          placeholder="글 내용을 입력해주세요."
          value={contentInput}
          ref={contentInputRef}
          onChange={(e) => setContentInput(e.target.value)}
        />
      </Stack>
      <Button className="writeButton" variant="secondary" value={contentInput} onClick={() => writeNewPost(titleInput)} onChange={(e) => setContentInput(e.target.value)}>
        글쓰기
      </Button>
    </>
    // 글제목 인풋 클릭하면 글 내용 폼 나오기 ok
    // 글쓰기 눌렀을 때 글 내용 비어있으면 포커싱하기
    // 게시물 작성되면 글 내용 폼 사라지기
  );
};

export default WriteForm;
