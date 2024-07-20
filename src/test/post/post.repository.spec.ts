import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostRepository } from 'src/post/repository/post.repository.interface';
import { PostTypeormRepository } from 'src/post/repository/typeorem/post.typeorm.repository';
import { Post } from 'src/post/schemas/post.schema';
import { createPostMock } from '../mocks/post.mock';
import { IPaginationParams } from 'src/shared/types/pagination.types';
import { FindTeacherPostsDto } from 'src/post/dto/find-teacher-posts.dto';
import { ILike } from 'typeorm';

const mockPostTypeOrmRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('PostRepository', () => {
  let postRepository: PostRepository;
  let postTypeOrmMock: typeof mockPostTypeOrmRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostTypeormRepository,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostTypeOrmRepository,
        },
      ],
    }).compile();

    jest.clearAllMocks();

    postRepository = moduleRef.get<PostRepository>(PostTypeormRepository);
    postTypeOrmMock = moduleRef.get(getRepositoryToken(Post));
  });

  describe('create', () => {
    it('should create a post in database', async () => {
      const post = createPostMock();

      postTypeOrmMock.save.mockResolvedValueOnce(post);

      const response = await postRepository.create(post);

      expect(response).toEqual(post);
      expect(postTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.save).toHaveBeenCalledWith(post);
    });

    it('should throw if database access fail', async () => {
      const post = createPostMock();

      postTypeOrmMock.save.mockRejectedValueOnce(new Error());

      const promise = postRepository.create(post);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.save).toHaveBeenCalledWith(post);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = Array.from({ length: 5 }, createPostMock);

      postTypeOrmMock.find.mockResolvedValueOnce(posts);

      const params: IPaginationParams = {
        limit: 10,
        page: 1,
      };

      const response = await postRepository.findAll(params);

      expect(response).toEqual(posts);
      expect(postTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.find).toHaveBeenCalledWith({
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      });
    });

    it('should throw if database access fail', async () => {
      postTypeOrmMock.find.mockRejectedValueOnce(new Error());

      const params: IPaginationParams = {
        limit: 10,
        page: 1,
      };

      const promise = postRepository.findAll(params);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.find).toHaveBeenCalledWith({
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      });
    });
  });

  describe('findTeacherPosts', () => {
    it('should return an array of posts', async () => {
      const posts = Array.from({ length: 5 }, createPostMock);

      postTypeOrmMock.find.mockResolvedValueOnce(posts);

      const params: FindTeacherPostsDto = {
        teacher_id: 'teacher_id',
        limit: 10,
        page: 1,
      };

      const response = await postRepository.findTeacherPosts(params);

      expect(response).toEqual(posts);
      expect(postTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.find).toHaveBeenCalledWith({
        where: {
          user: { id: params.teacher_id },
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      });
    });

    it('should throw if database access fail', async () => {
      postTypeOrmMock.find.mockRejectedValueOnce(new Error());

      const params: FindTeacherPostsDto = {
        teacher_id: 'teacher_id',
        limit: 10,
        page: 1,
      };

      const promise = postRepository.findTeacherPosts(params);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.find).toHaveBeenCalledWith({
        where: {
          user: { id: params.teacher_id },
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      });
    });
  });

  describe('findById', () => {
    it('should return a post by id if exists in database', async () => {
      const post = createPostMock();

      postTypeOrmMock.findOne.mockResolvedValueOnce(post);

      const id = 'post_id';

      const response = await postRepository.findById(id);

      expect(response).toEqual(post);
      expect(postTypeOrmMock.findOne).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.findOne).toHaveBeenCalledWith({
        where: {
          id,
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
      });
    });

    it('should return null if post does not exist in database', async () => {
      postTypeOrmMock.findOne.mockResolvedValueOnce(null);

      const id = 'post_id';

      const response = await postRepository.findById(id);

      expect(response).toBeNull();
      expect(postTypeOrmMock.findOne).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.findOne).toHaveBeenCalledWith({
        where: {
          id,
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
      });
    });

    it('should throw if database access fail', async () => {
      postTypeOrmMock.findOne.mockRejectedValueOnce(new Error());

      const id = 'post_id';

      const promise = postRepository.findById(id);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.findOne).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.findOne).toHaveBeenCalledWith({
        where: {
          id,
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
      });
    });
  });

  describe('findByText', () => {
    it('should return an array of posts', async () => {
      const posts = Array.from({ length: 2 }, createPostMock);

      postTypeOrmMock.find.mockResolvedValueOnce(posts);

      const text = 'post title';

      const response = await postRepository.findByText(text);

      expect(response).toEqual(posts);
      expect(postTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.find).toHaveBeenCalledWith({
        where: [
          {
            title: ILike(`%${text}%`),
          },
          { description: ILike(`%${text}%`) },
        ],
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
      });
    });

    it('should throw if database access fail', async () => {
      postTypeOrmMock.find.mockRejectedValueOnce(new Error());

      const text = 'post_title';

      const promise = postRepository.findByText(text);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.find).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.find).toHaveBeenCalledWith({
        where: [
          {
            title: ILike(`%${text}%`),
          },
          { description: ILike(`%${text}%`) },
        ],
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
          },
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete post in database', async () => {
      postTypeOrmMock.delete.mockImplementationOnce(jest.fn);

      const id = 'postId';

      const response = await postRepository.delete(id);

      expect(response).toBeUndefined();
      expect(postTypeOrmMock.delete).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.delete).toHaveBeenCalledWith({ id });
    });

    it('should throw if database access fail', async () => {
      postTypeOrmMock.delete.mockRejectedValueOnce(new Error());

      const id = 'postId';

      const promise = postRepository.delete(id);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.delete).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.delete).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should create a post in database', async () => {
      const post = createPostMock();

      postTypeOrmMock.save.mockResolvedValueOnce(post);

      const response = await postRepository.update(post);

      expect(response).toEqual(post);
      expect(postTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.save).toHaveBeenCalledWith(post);
    });

    it('should throw if database access fail', async () => {
      const post = createPostMock();

      postTypeOrmMock.save.mockRejectedValueOnce(new Error());

      const promise = postRepository.update(post);

      await expect(promise).rejects.toEqual(Error());
      expect(postTypeOrmMock.save).toHaveBeenCalledTimes(1);
      expect(postTypeOrmMock.save).toHaveBeenCalledWith(post);
    });
  });
});
