import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import Error404 from '@/pages/notFound';
import { showErrorToast } from "@/utilities";
import PostCard from "@/components/postcard";
import interviewImage from "@/assets/svgs/interview.svg";
import Button from "@/components/button";

import "./styles.scss";
import { getReq } from "@/api";

const CTA_TEXT = "post an ask";
const DEFAULT_SKELETON_HEIGHT = "225px";
export default function Index(props) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({});

    useEffect(() => {
        const paramId = props.match.params.id;
        getReq(`/post/byreferral/${paramId}`)
            .then(({ data: response }) => {
                const {
                    attachedPost: { post, error },
                } = response;
                if(error){
                    alert('error');
                    return;
                }
                setPost({ ...post, referralId: paramId });
            })
            .catch((err) => {
                console.log(err)
                showErrorToast("There was an error:", err.message);
                // history.push("/");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const gotoCreatePost = () => {
        history.push("/post");
    };

    return <Error404 />

    return (
        <div id="referral-page">
            {loading ? (
                <Skeleton style={{ height: DEFAULT_SKELETON_HEIGHT }} />
            ) : (
                <PostCard post={post} />
            )} 
            <img src={interviewImage} alt="poster" className="poster-image" />
            <div className="post-ask">
                <Button text={CTA_TEXT} onClick={gotoCreatePost} />
            </div>
        </div>
    );
}
