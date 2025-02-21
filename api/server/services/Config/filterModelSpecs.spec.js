const filterModelSpecs = require('./filterModelSpecs');

describe('filterModelSpecs', () => {
  const mockModelSpecs = {
    enforce: true,
    prioritize: true,
    list: [
      {
        name: 'Public Model',
        label: 'Public Model',
        preset: { endpoint: 'openAI' },
      },
      {
        name: 'Private Model',
        label: 'Private Model',
        preset: { endpoint: 'openAI' },
        allowedGroups: ['ec0afe4a-76bd-465b-912b-0b8381e700fe'],
      },
      {
        name: 'Multi-Group Model',
        label: 'Multi-Group Model',
        preset: { endpoint: 'openAI' },
        allowedGroups: [
          'ec0afe4a-76bd-465b-912b-0b8381e700fe',
          'fac4bdb1-0811-4ffd-85cd-abed41dcf7e6',
        ],
      },
    ],
  };

  it('should return all models when no groups are specified in models', () => {
    const modelSpecs = {
      enforce: true,
      prioritize: true,
      list: [
        {
          name: 'Model 1',
          label: 'Model 1',
          preset: { endpoint: 'openAI' },
        },
        {
          name: 'Model 2',
          label: 'Model 2',
          preset: { endpoint: 'openAI' },
        },
      ],
    };

    const userGroups = ['some-group-id'];
    const result = filterModelSpecs(modelSpecs, userGroups);
    expect(result.list).toHaveLength(2);
  });

  it('should return only public models when user has no groups', () => {
    const result = filterModelSpecs(mockModelSpecs, []);
    expect(result.list).toHaveLength(1);
    expect(result.list[0].name).toBe('Public Model');
  });

  it('should return models user has access to based on group membership', () => {
    const userGroups = ['ec0afe4a-76bd-465b-912b-0b8381e700fe'];
    const result = filterModelSpecs(mockModelSpecs, userGroups);
    expect(result.list).toHaveLength(3);
  });

  it('should handle invalid or missing modelSpecs gracefully', () => {
    expect(filterModelSpecs(null, [])).toBeNull();
    expect(filterModelSpecs(undefined, [])).toBeUndefined();
    expect(filterModelSpecs({}, [])).toEqual({});
    expect(filterModelSpecs({ list: null }, [])).toEqual({ list: null });
  });

  it('should handle invalid allowedGroups in specs gracefully', () => {
    const invalidSpecs = {
      list: [
        {
          name: 'Invalid Groups',
          label: 'Invalid Groups',
          preset: { endpoint: 'openAI' },
          allowedGroups: 'not-an-array',
        },
      ],
    };

    const result = filterModelSpecs(invalidSpecs, ['some-group']);
    expect(result.list).toHaveLength(1);
  });

  it('should match any group from allowedGroups', () => {
    const userGroups = ['fac4bdb1-0811-4ffd-85cd-abed41dcf7e6'];
    const result = filterModelSpecs(mockModelSpecs, userGroups);
    expect(result.list).toHaveLength(2);
    expect(result.list.some((m) => m.name === 'Multi-Group Model')).toBe(true);
  });
});