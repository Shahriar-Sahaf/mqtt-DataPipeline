const { saveDataToDatabase } = require('../worker');
const pg = require('../DB/pg/pg');
const mongo = require('../DB/MongoDB/mongoose');
const redis = require('../DB/Redis/config');
const publisher = require('../DB/Redis/getAndPublish');


jest.mock('../DB/pg/pg', () => ({
  saveToPostgres: jest.fn(),
}));

jest.mock('../DB/MongoDB/mongoose', () => ({
  saveTomongo: jest.fn(),
}));

jest.mock('../DB/Redis/config', () => ({
  redisCache: jest.fn(),
}));

jest.mock('../DB/Redis/getAndPublish', () => ({
  getAndPublish: jest.fn(),
}));

jest.mock('mqtt', () => ({
  connect: jest.fn(() => ({
    on: jest.fn(),
    subscribe: jest.fn((topic, cb) => cb && cb(null)),
    publish: jest.fn((topic, msg, cb) => cb && cb(null)),
  })),
}));

describe('saveDataToDatabase', () => {
  const mockData = {
    device: 8515,
    temperature: 22.5,
    humidity: 55,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls all database and cache methods with correct data', async () => {
    await saveDataToDatabase(mockData);

    expect(pg.saveToPostgres).toHaveBeenCalledWith(mockData);
    expect(mongo.saveTomongo).toHaveBeenCalledWith(mockData);
    expect(redis.redisCache).toHaveBeenCalledWith(mockData);
    expect(publisher.getAndPublish).toHaveBeenCalledWith(mockData.device);
  });

  it('handles errors gracefully if one of the functions fails', async () => {
    pg.saveToPostgres.mockRejectedValueOnce(new Error('Postgres Error'));

    await expect(saveDataToDatabase(mockData)).resolves.toBeUndefined();

    expect(pg.saveToPostgres).toHaveBeenCalledWith(mockData);
    expect(mongo.saveTomongo).not.toHaveBeenCalled(); 
  });
});
