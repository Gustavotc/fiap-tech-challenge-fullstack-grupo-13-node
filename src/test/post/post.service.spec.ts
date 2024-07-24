import { Test } from '@nestjs/testing';
import { PostService } from 'src/post/post.service';
import { PostRepository } from 'src/post/repository/post.repository.interface';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import { UpdatePostDto } from 'src/post/dto/update-post.dto';
import { DeletePostDto } from 'src/post/dto/delete-post.dto';
import { FindTeacherPostsDto } from 'src/post/dto/find-teacher-posts.dto';
import { createPostMock } from '../mocks/post.mock';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { createUserMock } from '../mocks/user.mock';
import { createPostDtoMock } from '../mocks/createPostDtoMock';
import { Post } from 'src/post/schemas/post.schema';

const mockPostRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findTeacherPosts: jest.fn(),
  findByText: jest.fn(),
};

const mockUserRepository = {
  findById: jest.fn(),
};

describe('PostService', () => {
  let postService: PostService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: mockPostRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    postService = moduleRef.get<PostService>(PostService);
  });

  describe('create', () => {
    it('should create and return a post', async () => {
      const createPostDto = createPostDtoMock();

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);

      const newPost = new Post();
      newPost.title = createPostDto.title;
      newPost.description = createPostDto.description;
      newPost.category = createPostDto.category;
      newPost.user = user;

      const insertedPost: Post = {
        ...newPost,
        id: 'id',
        createAt: new Date(),
        updateAt: new Date(),
      };

      jest
        .spyOn(mockPostRepository, 'create')
        .mockResolvedValueOnce(insertedPost);

      const result = await postService.create(createPostDto);

      expect(result).toEqual(insertedPost);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.create).toHaveBeenCalledWith(newPost);
    });

    it('should throw UnauthorizedException if user is not DOCENTE', async () => {
      const createPostDto: CreatePostDto = {
        title: 'New Post',
        description: 'Post Description',
        category: 'General',
        user_id: 'user1',
      };

      const user = createUserMock();
      user.role.type = 'DISCENTE'; // Definindo o usuário como não autorizado

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);

      await expect(postService.create(createPostDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        createPostDto.user_id,
      );
      expect(mockPostRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = createPostMock();

      jest.spyOn(mockPostRepository, 'findAll').mockResolvedValueOnce(posts);

      const params = { limit: 5, page: 1 };
      const result = await postService.findAll(params);

      expect(result).toEqual(posts);
      expect(mockPostRepository.findAll).toHaveBeenCalledWith(params);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const post = createPostMock();

      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(post);

      const postId = 'post1';
      const result = await postService.findOne(postId);

      expect(result).toEqual(post);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
    });

    it('should throw NotFoundException if post is not found', async () => {
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(null);

      const postId = 'post1';
      await expect(postService.findOne(postId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should update and return a post', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post1',
        user_id: 'user1',
        title: 'Updated Post',
        description: 'Updated Description',
        category: 'Updated Category',
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      const post = createPostMock();
      post.user = user;

      updatePostDto.post_id = post.id;
      updatePostDto.user_id = user.id;

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(post);
      jest.spyOn(mockPostRepository, 'update').mockResolvedValueOnce(post);

      const result = await postService.update(updatePostDto);

      expect(result).toEqual(post);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        updatePostDto.user_id,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        updatePostDto.post_id,
      );
      expect(mockPostRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: post.id,
          title: updatePostDto.title,
          description: updatePostDto.description,
          category: updatePostDto.category,
          user,
        }),
      );
    });

    it('should throw UnauthorizedException if user is not DOCENTE', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post1',
        user_id: 'user1',
        title: 'Updated Post',
        description: 'Updated Description',
        category: 'Updated Category',
      };

      const user = createUserMock();
      user.role.type = 'DISCENTE';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);

      await expect(postService.update(updatePostDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        updatePostDto.user_id,
      );
      expect(mockPostRepository.findById).not.toHaveBeenCalled();
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if post is not found', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post1',
        user_id: 'user1',
        title: 'Updated Post',
        description: 'Updated Description',
        category: 'Updated Category',
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(null);

      await expect(postService.update(updatePostDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        updatePostDto.user_id,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        updatePostDto.post_id,
      );
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if post.user.id does not match user_id', async () => {
      const updatePostDto: UpdatePostDto = {
        post_id: 'post1',
        user_id: 'user1',
        title: 'Updated Post',
        description: 'Updated Description',
        category: 'Updated Category',
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      const post = createPostMock();
      post.user = user;

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(post);

      await expect(postService.update(updatePostDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        updatePostDto.user_id,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        updatePostDto.post_id,
      );
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const deletePostDto: DeletePostDto = {
        post_id: 'post1',
        user_id: 'user1',
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      const post = createPostMock();
      post.user = user;

      deletePostDto.post_id = post.id;
      deletePostDto.user_id = user.id;

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(post);
      jest.spyOn(mockPostRepository, 'delete').mockResolvedValueOnce(undefined);

      const result = await postService.delete(deletePostDto);

      expect(result).toBeUndefined();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        deletePostDto.user_id,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        deletePostDto.post_id,
      );
      expect(mockPostRepository.delete).toHaveBeenCalledWith(
        deletePostDto.post_id,
      );
    });

    it('should throw UnauthorizedException if user is not DOCENTE', async () => {
      const deletePostDto: DeletePostDto = {
        post_id: 'post1',
        user_id: 'user1',
      };

      const user = createUserMock();
      user.role.type = 'DISCENTE';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);

      await expect(postService.delete(deletePostDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        deletePostDto.user_id,
      );
      expect(mockPostRepository.findById).not.toHaveBeenCalled();
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if post is not found', async () => {
      const deletePostDto: DeletePostDto = {
        post_id: 'post1',
        user_id: 'user1',
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(null);

      await expect(postService.delete(deletePostDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        deletePostDto.user_id,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        deletePostDto.post_id,
      );
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if post.user.id does not match user_id', async () => {
      const deletePostDto: DeletePostDto = {
        post_id: 'post1',
        user_id: 'user1',
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      const post = createPostMock();
      post.user = user;

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(mockPostRepository, 'findById').mockResolvedValueOnce(post);

      await expect(postService.delete(deletePostDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        deletePostDto.user_id,
      );
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        deletePostDto.post_id,
      );
      expect(mockPostRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('findTeacherPosts', () => {
    it('should return an array of posts by teacher', async () => {
      const findTeacherPostsDto: FindTeacherPostsDto = {
        teacher_id: 'teacher1',
        limit: 5,
        page: 1,
      };

      const user = createUserMock();
      user.role.type = 'DOCENTE';

      const posts = createPostMock();
      posts.user = user;

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);
      jest
        .spyOn(mockPostRepository, 'findTeacherPosts')
        .mockResolvedValueOnce(posts);

      const result = await postService.findTeacherPosts(findTeacherPostsDto);

      expect(result).toEqual(posts);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        findTeacherPostsDto.teacher_id,
      );
      expect(mockPostRepository.findTeacherPosts).toHaveBeenCalledWith(
        findTeacherPostsDto,
      );
    });

    it('should throw UnauthorizedException if user is not DOCENTE', async () => {
      const findTeacherPostsDto: FindTeacherPostsDto = {
        teacher_id: 'teacher1',
        limit: 5,
        page: 1,
      };

      const user = createUserMock();
      user.role.type = 'DISCENTE';

      jest.spyOn(mockUserRepository, 'findById').mockResolvedValueOnce(user);

      await expect(
        postService.findTeacherPosts(findTeacherPostsDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        findTeacherPostsDto.teacher_id,
      );
      expect(mockPostRepository.findTeacherPosts).not.toHaveBeenCalled();
    });
  });

  describe('findByText', () => {
    it('should return an array of posts containing the text', async () => {
      const posts = createPostMock();
      const text = 'search text';

      jest.spyOn(mockPostRepository, 'findByText').mockResolvedValueOnce(posts);

      const result = await postService.findByText(text);

      expect(result).toEqual(posts);
      expect(mockPostRepository.findByText).toHaveBeenCalledWith(text);
    });
  });
});
