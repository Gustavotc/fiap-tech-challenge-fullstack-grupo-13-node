import { Test } from "@nestjs/testing";
import { PostController } from "src/post/post.controller";
import { PostService } from "src/post/post.service";
import { PostRepository } from "src/post/repository/post.repository.interface";
import { Post } from "src/post/schemas/post.schema";
import { createPostMock } from "../mocks/post.mock";
import { FindTeacherPostsDto } from "src/post/dto/find-teacher-posts.dto";
import { CreatePostDto } from "src/post/dto/create-post.dto";
import { NotFoundException } from "@nestjs/common";
import { UpdatePostDto } from "src/post/dto/update-post.dto";
import { UserRepository } from "src/user/repository/user.repository.interface";
import { DeletePostDto } from "src/post/dto/delete-post.dto";


const mockPostRepository = {};
const mockUserRepository = {};


describe('PostController', () => {
    let postController: PostController;
    let postService: PostService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [PostController],
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
        postController = moduleRef.get<PostController>(PostController);
    });

    describe('findTeacherPosts', () => {
        it('should return an array of posts by teacher', async () => {

            const result: Post[] = Array.from({ length: 3 }, createPostMock);

            jest.spyOn(postService, 'findTeacherPosts').mockResolvedValueOnce(result);

            const findTeacherPostsDto: FindTeacherPostsDto = {
                teacher_id: '1',
                page: 1,
                limit: 1,
            }

            const response = await postController.findTeacherPosts(findTeacherPostsDto);

            expect(response).toEqual(result);
            expect(postService.findTeacherPosts).toHaveBeenCalledTimes(1);
            expect(postService.findTeacherPosts).toHaveBeenCalledWith(findTeacherPostsDto);
        });

        it('should throw an error if repository fail', async () => {
            jest.spyOn(postService, 'findTeacherPosts').mockRejectedValueOnce(new Error());

            const findTeacherPostsDto: FindTeacherPostsDto = {
                teacher_id: '1',
                page: 1,
                limit: 1,
            }

            const promise = postController.findTeacherPosts(findTeacherPostsDto);

            await expect(promise).rejects.toStrictEqual(Error());
            expect(postService.findTeacherPosts).toHaveBeenCalledWith(findTeacherPostsDto);
        });
    });

    describe('findByText', () => {

        it('should return an post array of posts by text', async () => {
            const result: Post[] = Array.from({ length: 3 }, createPostMock);

            jest.spyOn(postService, 'findByText').mockResolvedValueOnce(result);

            const text = 'teste';

            const response = await postController.findByText(text);

            expect(response).toEqual(result);
            expect(postService.findByText).toHaveBeenCalledTimes(1);
            expect(postService.findByText).toHaveBeenCalledWith(text);
        });
    });

    describe('create', () => {
        it('should create and return a post', async () => {

            const createPostDto: CreatePostDto = {
                title: 'titulo',
                description: 'descricao',
                category: 'categoria',
                user_id: 'userid',
            };

            const post: Post = createPostMock();

            jest.spyOn(postService, 'create').mockResolvedValueOnce(post);

            const response = await postController.create(createPostDto)

            expect(response).toStrictEqual(post);
            expect(postService.create).toHaveBeenCalledTimes(1);
            expect(postService.create).toHaveBeenCalledWith(createPostDto);
        });

        it('should throw an error if repository fail', async () => {
            jest.spyOn(postService, 'create').mockRejectedValueOnce(new Error());

            const createPostDto: CreatePostDto = {
                title: 'titulo',
                description: 'descricao',
                category: 'categoria',
                user_id: 'userid',
            };

            const promise = postController.create(createPostDto);

            await expect(promise).rejects.toStrictEqual(Error());
            expect(postService.create).toHaveBeenCalledTimes(1);
            expect(postService.create).toHaveBeenCalledWith(createPostDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of posts', async () => {
            const result: Post[] = Array.from({ length: 3 }, createPostMock);

            jest.spyOn(postService, 'findAll').mockResolvedValueOnce(result);

            const response = await postController.findAll({
                limit: 5,
                page: 1,
            });

            expect(response).toEqual(result);
            expect(postService.findAll).toHaveBeenCalledWith({ limit: 5, page: 1 });
        });

        it('should throw an error if repository fail', async () => {
            jest.spyOn(postService, 'findAll').mockRejectedValueOnce(new Error());

            const promise = postController.findAll({
                limit: 1,
                page: 1,
            });

            await expect(promise).rejects.toStrictEqual(Error());
            expect(postService.findAll).toHaveBeenCalledWith({ limit: 1, page: 1 });
        });
    });

    describe('findOne', () => {
        it('should return a post', async () => {
            const result: Post = createPostMock();
            jest.spyOn(postService, 'findOne').mockResolvedValueOnce(result);

            const postId = '648ffb64-1e2f-4091-8877-28a76e48b287';
            const response = await postController.findOne(postId);

            expect(response).toEqual(result);
            expect(postService.findOne).toHaveBeenCalledTimes(1);
            expect(postService.findOne).toHaveBeenCalledWith(postId);
        });

        it('should throw an error if repository fail', async () => {
            jest.spyOn(postService, 'findOne').mockRejectedValueOnce(new Error());

            const postId = '648ffb64-1e2f-4091-8877-28a76e48b287';
            const promise = postController.findOne(postId);

            await expect(promise).rejects.toStrictEqual(Error());
            expect(postService.findOne).toHaveBeenCalledTimes(1);
            expect(postService.findOne).toHaveBeenCalledWith(postId);
        });

        it('should throw a NotFoundException when the post is not found', async () => {
            jest.spyOn(postService, 'findOne').mockRejectedValue(new NotFoundException('Post not found'));

            await expect(postService.findOne('1')).rejects.toThrow(NotFoundException);
            expect(postService.findOne).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update and return a post', async () => {

            const postId = '648ffb64-1e2f-4091-8877-28a76e48b287';
            const post: Post = createPostMock();
            post.id = postId;

            jest.spyOn(postService, 'update').mockResolvedValueOnce(post);

            const updatePostDto: UpdatePostDto = {
                title: 'titulo',
                description: 'descricao',
                category: 'categoria',
                user_id: 'userid',
            };

            postController.update(updatePostDto);

            expect(postService.update).toHaveBeenCalledTimes(1);
            expect(postService.update).toHaveBeenCalledWith(updatePostDto);
        });

        it('should throw a NotFoundException when the post is not found', async () => {
            jest.spyOn(postService, 'update').mockRejectedValue(new NotFoundException('Post not found'));

            const postId = '648ffb64-1e2f-4091-8877-28a76e48b287';
            const updatePostDto: UpdatePostDto = {
                title: 'titulo',
                description: 'descricao',
                category: 'categoria',
                user_id: 'userid',
            };

            await expect(postService.update(updatePostDto)).rejects.toThrow(NotFoundException);
            expect(postService.update).toHaveBeenCalledWith(updatePostDto);
        });
    });

    describe('delete', () => {
        it('should delete a post', async () => {

            const deletePostDTO: DeletePostDto = {
                user_id: '648ffb64-1e2f-4091-8877-28a76e48b287',
                post_id: 'a7563a25-dd30-4de9-8398-8859512b0ab9'
            };
            jest.spyOn(postService, 'delete').mockResolvedValueOnce();

            await postController.delete(deletePostDTO);

            expect(postService.delete).toHaveBeenCalledTimes(1);
            expect(postService.delete).toHaveBeenCalledWith(deletePostDTO);
        });

        it('should throw a NotFoundException when the post is not found', async () => {
            const deletePostDTO: DeletePostDto = {
                user_id: '648ffb64-1e2f-4091-8877-28a76e48b287',
                post_id: 'a7563a25-dd30-4de9-8398-8859512b0ab9'
            };

            jest.spyOn(postService, 'delete').mockRejectedValue(new NotFoundException('Post not found'));

            await expect(postController.delete(deletePostDTO)).rejects.toThrow(NotFoundException);
            expect(postService.delete).toHaveBeenCalledWith(deletePostDTO);
        });
    });

});