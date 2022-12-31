import "./css/reset.css";
import "./css/App.scss";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { modifyPostData, plusLike, setPostData } from "./store";
import WriteForm from "./components/WriteForm";

// 글 내용 작성기능, 카테고리 기능 구현 추가
function App() {
  const dispatch = useDispatch();
  const postData = useSelector((state) => state.postData);
  const [copiedPostData, setCopiedPostData] = useState([...postData]); // 화면 출력용 postData 복사본 (정렬, 검색)

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [titleRenameInput, setTitleRenameInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [orderForSort, setOrderForSort] = useState("new"); // 정렬 옵션: new, old, alphabet

  const [modifyVisible, setModifyVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // 삭제하기 버튼 누르면 포스트 삭제
  const deletePost = (index) => {
    const tempPostData = [...postData];
    if (window.confirm(`"${tempPostData[index].title}" 게시물을 정말로 삭제하겠습니까?`)) {
      tempPostData.splice(index, 1);
      dispatch(setPostData(tempPostData));
    }
  };

  // 수정하기 버튼 누르면 게시물 제목을 수정할 수 있도록 창이 열림
  const openModifyModal = (postId) => {
    const foundPost = postData.find((el) => el.id === postId);
    setSelectedPostId(postId);
    setTitleRenameInput(foundPost.title);
    setModifyVisible(true);
  };

  // 엔터 키 누르거나 확인 버튼 클릭하면 게시물 제목이 수정 됨
  const modifyPost = (postId, titleRenameInput) => {
    const foundPost = postData.find((el) => el.id === postId);
    setTitleRenameInput(foundPost.title);
    dispatch(modifyPostData([postId, titleRenameInput]));
    setModifyVisible(false);
  };

  // 게시물 제목을 클릭하면 게시물 내용을 자세히 보여주고, 이미 열려있다면 닫힘
  const viewContentModal = (postId) => {
    setSelectedPostId(postId);
    if (selectedPostId === postId && contentModalVisible) {
      return setContentModalVisible(false);
    }
    setContentModalVisible(true);
    setModifyVisible(false);
  };

  // 정렬 옵션을 선택하면 게시물이 정렬됨 (최신순, 오래된 순, 가나다순)
  const sortPost = (order) => {
    const tempPostData = [...postData];
    setOrderForSort(order);
    if (order === "new") {
      tempPostData.sort((a, b) => b.id - a.id);
    }
    if (order === "old") {
      tempPostData.sort((a, b) => a.id - b.id);
    }
    if (order === "alphabet") {
      tempPostData.sort((a, b) => a.title.localeCompare(b.title));
    }
    setCopiedPostData(tempPostData);
  };

  // 검색 창에 검색어를 입력하면 검색어를 제목에 포함한 게시물을 출력함
  const searchPost = (searchInput) => {
    if (searchInput !== "") {
      const tempPostData = [...postData];
      const foundPost = tempPostData.filter((el) => el.title.includes(searchInput));
      setCopiedPostData(foundPost);
    }
  };

  // 검색, 정렬로 재정렬된 게시물들의 위치를 항상 유지하는 기능
  const maintainRender = () => {
    setCopiedPostData(postData);
    sortPost(orderForSort);
    searchPost(searchInput);
  };

  // 데이터 변경 시 출력 화면 유지
  useEffect(() => {
    console.log(postData);
    maintainRender();
  }, [postData]);

  // 검색어 입력 시 출력 화면 유지
  useEffect(() => {
    maintainRender();
  }, [searchInput, orderForSort]);

  return (
    <div className="App">
      <div className="container">
        <Stack gap={1}>
          <div className="utility">
            <div className="searchBox">
              <Button
                className="searchButton"
                onClick={() => {
                  setSearchInput("");
                  setSearchVisible(!searchVisible);
                }}
              >
                {searchVisible ? "취소하기" : "검색하기"}
              </Button>
              <Form.Control
                className={`me-auto searchInput ${searchVisible && "visible"}`}
                placeholder="검색어를 입력해주세요."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyUp={() => window.event.keyCode === 13 && searchPost(searchInput)}
              />
              <div
                className={`closeIcon ${searchVisible && "visible"}`}
                onClick={() => {
                  setSearchInput("");
                }}
              >
                ❌
              </div>
            </div>
            <Form.Select className="sort" aria-label="Default select example" value={orderForSort} onChange={(e) => sortPost(e.target.value)}>
              <option value="new">최신순</option>
              <option value="old">오래된 순</option>
              <option value="alphabet">가나다순</option>
            </Form.Select>
            <WriteForm />
          </div>
          {postData.length === 0 ? (
            <div>게시물이 없습니다.</div>
          ) : (
            copiedPostData.map((post, index) => {
              return (
                <div key={post.id} className={`bg-light post ${selectedPostId === post.id && modifyVisible && "stressBorder"}`}>
                  <div className="overviewPost">
                    <span className="postIndex">{post.id + 1}</span>
                    <div className={`modifyForm ${selectedPostId === post.id && modifyVisible && "visible"}`}>
                      <Form.Control
                        className="me-auto modifyBox"
                        value={titleRenameInput}
                        onChange={(e) => setTitleRenameInput(e.target.value)}
                        onKeyUp={() => window.event.keyCode === 13 && modifyPost(post.id, titleRenameInput)}
                      />
                      <Button className="confirm" variant="outline-primary" onClick={() => modifyPost(post.id, titleRenameInput)}>
                        <strong>확인</strong>
                      </Button>
                      <Button className="cancel" variant="outline-primary" onClick={() => setModifyVisible(false)}>
                        <strong>취소</strong>
                      </Button>
                    </div>
                    <div
                      className="text"
                      onClick={() => {
                        console.log(post);
                        viewContentModal(post.id, index);
                      }}
                    >
                      <strong>{post.title}</strong>
                      <span>{post.content}</span>
                    </div>
                    <div className="buttonBox">
                      <Button className="modify" variant="outline-primary" onClick={() => openModifyModal(post.id)}>
                        <strong>수정하기</strong>
                      </Button>
                      <Button className="delete" variant="outline-primary" onClick={() => deletePost(index)}>
                        <strong>삭제하기</strong>
                      </Button>
                      <Button className="like" variant="outline-primary" onClick={() => dispatch(plusLike(post.id))}>
                        <strong>❤</strong>
                        <span>{copiedPostData[index].like}</span>
                      </Button>
                    </div>
                  </div>

                  <div className={`contentModal ${selectedPostId === post.id && contentModalVisible && "visible"}`}>
                    <span className="date">{post.date}</span>
                    <p>{post.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </Stack>
      </div>
    </div>
  );
}

// 글추가 순서
// 입력 값 저장할 titleState 만들기
// input value를 titleState와 같도록 설정하기
// setTitleState로 input value값으로 변화시키기
// input value가 비어있으면 입력창 포커스하기
// 데이터에 input value 추가하기
// 글 작성 뒤 input value 초기화하기

export default App;
