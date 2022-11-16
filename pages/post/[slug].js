import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getPosts, getPostDetails } from '../../services';
import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm, Loader } from '../../components';

const PostDetails = ({ initPost }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <Loader/>;
    }

    const [post, setPost] = useState(initPost);
    
    useEffect(() => {
        getPostDetails(initPost.slug)
        .then((newPosts) => setPost(newPosts));
    }, [initPost]);

    // TODO: somehow make it so that the title of the page matches the title of the post
    return (
        <div className='container mx-auto px-10 mb-8'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                <div className='col-span-1 lg:col-span-8'>
                    <PostDetail post={post}/>
                    <Author author={post.author}/>
                    <CommentsForm slug={post.slug}/>
                    <Comments slug={post.slug} />
                </div>
                <div className='col-span-1 lg:col-span-4'>
                    <div className='relative lg:sticky top-8'>
                        <PostWidget slug={post.slug} categories={post.categories.map((category) => category.slug)}/>
                        <Categories/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails

// Default function calling props from the graphQL CMS 
export async function getStaticProps({ params }) {
    await avoidRateLimit();
    const data = (await getPostDetails(params.slug)) || [];
    return {
        props: { initPost: data }
    }
}  

export async function getStaticPaths() {
    await avoidRateLimit();
    const posts = await getPosts();
    return {
        paths: posts.map(({ node: { slug }}) => ({ params: { slug }})), 
        fallback: true,
    }
}
export function avoidRateLimit(delay = 500) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay)
    })
  }