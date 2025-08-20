import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPosts, deletePost } from '../features/posts/postsSlice';

export const usePosts = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return { posts: list, loading, error, handleDelete };
};
