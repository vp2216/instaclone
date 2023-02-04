import { AiFillCamera, AiFillCloseCircle, AiFillLike } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { formatRelative } from "date-fns";
import icon from "../images/icon.png";
import load from "../images/loading.gif";
import { useNavigate } from "react-router-dom";

function PostView() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [getData, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [sample, setSample] = useState("");
  const [name, setName] = useState("loading");
  const [location, setLocation] = useState("loading");
  const [description, setDescription] = useState("");
  const [button, setButton] = useState(false);
  const [massage, setMassage] = useState("");
  const [submit, setSubmit] = useState(false);
  const [url, setUrl] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [warn, setWarn] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    if (image && name && location && description) {
      setButton(true);
    } else {
      setButton(false);
    }
  }, [image, name, location, description]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:8080/post/user", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setLocation(data.city);
      });
  }, []);

  function findData() {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:8080/post/", {
      headers: { Authorization: token },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setData(res);
      });
  }

  useEffect(() => {
    setTimeout(() => {
      setMassage("");
    }, 5000);
    findData();
    if (submit) {
      setSubmit(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [massage]);

  useEffect(() => {
    if (image) setSample(URL.createObjectURL(image));
    else setSample("");
  }, [image]);

  async function submition(e) {
    const token = sessionStorage.getItem("token");
    e.preventDefault();
    setSubmit(true);
    const formdata = new FormData();
    formdata.append("image", url);
    formdata.append("name", name);
    formdata.append("location", location);
    formdata.append("description", description);
    setOpen(false);
    const res = await fetch("http://localhost:8080/post/", {
      method: "POST",
      body: formdata,
      headers: { Authorization: token },
    });
    const msg = await res.json();
    setMassage(msg.massage);
    setImage(null);
    setImageName("");
    setDescription("");
    setUrl("");
  }

  useEffect(() => {
    // async function upload() {
    if (image) {
      setUrl("");
      setUploaded(false);
      const formdata = new FormData();
      formdata.append("file", image);
      formdata.append("upload_preset", `${cloudinary_preset_name}`);
      fetch(`https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`, {
        method: "POST",
        body: formdata,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
        });
    }
    // }
  }, [image]);

  useEffect(() => {
    if (image && url) {
      setUploaded(true);
      setSubmit(false);
    } else if (image && !url) {
      setSubmit(true);
    }
  }, [image, url]);

  function like(id) {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:8080/post/like/${id}`, {
      method: "POST",
      headers: { Authorization: token },
    });
    setTimeout(() => {
      findData();
    }, 100);
  }

  async function removePost(id) {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:8080/post/remove/${id}`, {
      method: "POST",
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => setMassage(data.massage));
  }

  return (
    <div>
      {/* NAVBAR */}

      <nav
        className="w-screen flex justify-between items-center py-3 sm:py-4 px-5 md:px-10 font-bold text-center text-2xl md:text-3xl fixed top-0 z-40 bg-gray-200"
        onClick={() => {
          if (open) setOpen(false);
          setMassage("");
        }}
      >
        <span className="flex justify-center items-center gap-3 cursor-default text-green-900 tracking-wider">
          <img src={icon} alt="icon" className="w-7 md:w-8" />
          InstaClone
        </span>
        <div className="flex gap-5 md:gap-10 justify-center items-center">
          <AiFillCamera
            className={`${
              open ? "opacity-0" : "opacity-100"
            } ease-in-out duration-500 text-3xl md:text-4xl cursor-pointer text-green-900 hover:scale-125`}
            onClick={() => setOpen(true)}
            title="Add Post"
          />
          <span
            className="text-base md:text-xl text-red-600 hover:text-red-500 cursor-pointer"
            onClick={() => {
              sessionStorage.setItem("token", "");
              navigate("/");
            }}
          >
            Logout
          </span>
        </div>
      </nav>

      {/* LOAD ON POST */}

      {submit ? (
        <img src={load} alt="loading" className="fixed z-50 submit" />
      ) : null}

      {/* MASSAGE */}

      {massage ? (
        <div className="fixed massage flex flex-col justify-center items-center bg-gray-900 z-50 p-10 gap-5 rounded">
          <span className="text-center font-bold tracking-wider text-white">
            {massage}
          </span>
          <button
            className="text-center font-bold px-5 py-3 bg-green-600 hover:bg-green-500 rounded tracking-wider"
            onClick={() => setMassage("")}
          >
            OK
          </button>
        </div>
      ) : null}

      {/* WARNING */}

      {warn ? (
        <div className="fixed massage flex flex-col justify-center items-center bg-gray-900 z-50 p-10 gap-5 rounded">
          <span className="text-center font-bold tracking-wider text-white">
            {warn}
          </span>
          <div className="flex gap-5">
            <button
              className="text-center font-bold px-5 py-3 text-white bg-red-600 hover:bg-red-500 rounded tracking-wider"
              onClick={() => {
                setWarn("");
                removePost(id);
                setId("");
              }}
            >
              YES
            </button>
            <button
              className="text-center text-white font-bold px-5 py-3 bg-green-600 hover:bg-green-500 rounded tracking-wider"
              onClick={() => {
                setWarn("");
                setId("");
              }}
            >
              NO
            </button>
          </div>
        </div>
      ) : null}

      {/* SIDEBAR */}

      <div
        className={`${
          open
            ? "md:translate-x-0 translate-y-0"
            : "md:translate-x-full md:translate-y-0 translate-x-0 translate-y-full"
        } fixed md:top-0 right-0 bottom-0 z-40 w-full py-16 md:w-2/5 bg-gray-300 ease-in-out duration-500 flex justify-center items-center`}
      >
        <AiFillCloseCircle
          className="text-3xl md:text-4xl cursor-pointer absolute top-5 right-10 text-green-900 hover:scale-125 ease-in-out duration-300"
          onClick={() => {
            setOpen(false);
            setImage(null);
            setImageName("");
            setDescription("");
          }}
          title="Close"
        />
        <form className="flex flex-col justify-center items-center gap-5 font-bold md:font-semibold text-center w-5/6 sm:w-4/6">
          <input
            type="file"
            accept="image/*"
            className="px-5 py-3 outline-none rounded bg-gray-200 w-full cursor-pointer"
            value={imageName}
            onChange={(e) => {
              setImage(e.target.files[0]);
              setImageName(e.target.value);
            }}
          />
          {sample ? (
            <img src={sample} alt="preview" className="w-2/4 hidden md:block" />
          ) : null}
          <textarea
            placeholder="Description"
            className="resize-none outline-none w-full rounded bg-gray-200 px-5 py-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <button
            className="px-5 py-3 bg-green-500 rounded tracking-wider w-full disabled:opacity-40"
            onClick={submition}
            disabled={button && uploaded ? false : true}
          >
            Post
          </button>
        </form>
      </div>

      {/* MAIN POST SECTION */}

      {name && location ? (
        <main
          className={`${
            open || massage || warn || submit ? "opacity-30" : "opacity-100"
          } w-screen pt-20 px-5 pb-10 md:pt-32 flex flex-col items-center gap-10 ease-in-out duration-500`}
          onClick={() => {
            setOpen(false);
            setMassage("");
          }}
        >
          {!getData ? (
            <div>
              <img src={load} alt="load" />
            </div>
          ) : (
            getData.map((data, i) => {
              return (
                <div
                  key={i}
                  className="shadow-lg shadow-gray-500 rounded py-5 font-bold md:font-semibold  w-full sm:w-3/5 lg:w-2/5 flex flex-col gap-5 bg-gray-200"
                >
                  <div className="flex justify-between items-center px-5">
                    <span className="flex flex-col">
                      <span className="text-sm md:text-base font-bold tracking-wide">
                        {data.name}
                      </span>
                      <span className="text-sm md:text-base text-gray-600 tracking-wide">
                        {data.location}
                      </span>
                    </span>
                    {data.name == name ? (
                      <MdDelete
                        className="text-xl cursor-pointer text-red-500 hover:scale-150 ease-in-out duration-300"
                        onClick={() => {
                          setId(data._id);
                          setWarn("Are you sure you want to remove the post?");
                        }}
                      />
                    ) : null}
                  </div>
                  <img src={data.image} alt="Post" className="w-full" />
                  <div className="px-5 flex flex-col justify-center items-start gap-2">
                    <span className="flex justify-between items-center w-full">
                      <AiFillLike
                        className="text-2xl cursor-pointer text-blue-900 hover:scale-150 ease-in-out duration-300"
                        onClick={() => like(data._id)}
                      />
                      <span className="text-sm md:text-base tracking-wide">
                        {formatRelative(new Date(data.createdAt), new Date())}
                      </span>
                    </span>
                    <span className="text-sm md:text-base text-gray-600">
                      {data.like.length} likes
                    </span>
                    <span className="break-words text-sm md:text-base font-bold">
                      {data.description}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </main>
      ) : (
        <div className="flex justify-center items-center flex-col gap-5 h-screen w-screen">
          <h2 className="text-xl font-bold text-center">
            Session expired please login again
          </h2>
          <button
            className="px-5 py-3 bg-green-700 hover:bg-green-600 rounded text-white font-semibold"
            onClick={() => navigate("/")}
          >
            Go to login
          </button>
        </div>
      )}
    </div>
  );
}

export default PostView;
