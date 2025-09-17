import { reverseArray, reverseArrayInPlace } from '@/utils/index';

describe('数组倒序工具函数测试', () => {
  describe('reverseArray', () => {
    it('应该返回倒序的新数组', () => {
      const input = [1, 2, 3, 4, 5];
      const result = reverseArray(input);
      
      expect(result).toEqual([5, 4, 3, 2, 1]);
      // 确保原数组没有被改变
      expect(input).toEqual([1, 2, 3, 4, 5]);
    });

    it('应该处理空数组', () => {
      const input: number[] = [];
      const result = reverseArray(input);
      
      expect(result).toEqual([]);
      expect(input).toEqual([]);
    });

    it('应该处理单个元素的数组', () => {
      const input = [42];
      const result = reverseArray(input);
      
      expect(result).toEqual([42]);
      expect(input).toEqual([42]);
    });

    it('应该处理字符串数组', () => {
      const input = ['a', 'b', 'c'];
      const result = reverseArray(input);
      
      expect(result).toEqual(['c', 'b', 'a']);
      expect(input).toEqual(['a', 'b', 'c']);
    });

    it('应该处理对象数组', () => {
      const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = reverseArray(input);
      
      expect(result).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
      expect(input).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });

    it('应该处理混合类型数组', () => {
      const input = [1, 'hello', true, null];
      const result = reverseArray(input);
      
      expect(result).toEqual([null, true, 'hello', 1]);
      expect(input).toEqual([1, 'hello', true, null]);
    });

    it('当输入不是数组时应该抛出错误', () => {
      expect(() => reverseArray('not an array' as any)).toThrow('Input must be an array');
      expect(() => reverseArray(123 as any)).toThrow('Input must be an array');
      expect(() => reverseArray(null as any)).toThrow('Input must be an array');
      expect(() => reverseArray(undefined as any)).toThrow('Input must be an array');
    });
  });

  describe('reverseArrayInPlace', () => {
    it('应该原地倒序数组', () => {
      const input = [1, 2, 3, 4, 5];
      const result = reverseArrayInPlace(input);
      
      expect(result).toEqual([5, 4, 3, 2, 1]);
      // 确保原数组被改变了
      expect(input).toEqual([5, 4, 3, 2, 1]);
      // 返回值应该是同一个数组引用
      expect(result).toBe(input);
    });

    it('应该处理空数组', () => {
      const input: number[] = [];
      const result = reverseArrayInPlace(input);
      
      expect(result).toEqual([]);
      expect(input).toEqual([]);
      expect(result).toBe(input);
    });

    it('应该处理单个元素的数组', () => {
      const input = [42];
      const result = reverseArrayInPlace(input);
      
      expect(result).toEqual([42]);
      expect(input).toEqual([42]);
      expect(result).toBe(input);
    });

    it('应该处理字符串数组', () => {
      const input = ['x', 'y', 'z'];
      const result = reverseArrayInPlace(input);
      
      expect(result).toEqual(['z', 'y', 'x']);
      expect(input).toEqual(['z', 'y', 'x']);
      expect(result).toBe(input);
    });

    it('当输入不是数组时应该抛出错误', () => {
      expect(() => reverseArrayInPlace('not an array' as any)).toThrow('Input must be an array');
      expect(() => reverseArrayInPlace(42 as any)).toThrow('Input must be an array');
      expect(() => reverseArrayInPlace({} as any)).toThrow('Input must be an array');
    });
  });

  describe('性能测试', () => {
    it('reverseArray 应该不改变原数组', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const copiedArray = [...originalArray];
      
      reverseArray(originalArray);
      
      expect(originalArray).toEqual(copiedArray);
    });

    it('reverseArrayInPlace 应该改变原数组', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const copiedArray = [...originalArray];
      
      reverseArrayInPlace(originalArray);
      
      expect(originalArray).not.toEqual(copiedArray);
    });
  });
});
