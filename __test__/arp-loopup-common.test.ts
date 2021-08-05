jest.mock('child_process')

import arp from '../src/index'

describe('Common', () => {
  Object.defineProperty(process, 'platform', {
    value: 'win32'
  })
  describe('Arp conversions', () => {
    test('Convert from ip to mac', async () => {
      const mac = await arp.toMAC('192.168.2.1')
      expect(mac).toBe('04:a1:51:1b:12:92')
    })
    test('Convert from mac to ip', async () => {
      const ip = await arp.toIP('04:a1:51:1b:12:92')
      expect(ip).toBe('192.168.2.1')
    })

    describe('arp.fromPrefix()', () => {
      test('Retrieves all matching devices', async () => {
        await expect(arp.fromPrefix('01:00:5e')).resolves.toEqual([
          { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'static', vendor: '' },
          { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'static', vendor: '' },
          { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'static', vendor: '' },
          { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'static', vendor: '' },
          { ip: '224.0.0.2', mac: '01:00:5e:00:00:02', type: 'static', vendor: '' },
          { ip: '224.0.0.22', mac: '01:00:5e:00:00:16', type: 'static', vendor: '' },
          { ip: '224.0.0.251', mac: '01:00:5e:00:00:fb', type: 'static', vendor: '' },
          { ip: '224.0.0.252', mac: '01:00:5e:00:00:fc', type: 'static', vendor: '' },
          { ip: '239.255.255.250', mac: '01:00:5e:7f:ff:fa', type: 'static', vendor: '' }
        ])
      })
      test("Returns empty array if there aren't any matching devices", async () => {
        await expect(arp.fromPrefix('00:00:00')).resolves.toEqual([])
      })
    })

    describe('arp.is()', () => {
      test('static mac', async () => {
        await expect(arp.is('static', '01:00:5e:00:00:02')).resolves.toBe(true)
      })
      test('static ip', async () => {
        await expect(arp.is('static', '192.168.2.255')).resolves.toBe(true)
      })
      test('dynamic mac', async () => {
        await expect(arp.is('dynamic', '04:a1:51:1b:12:92')).resolves.toBe(true)
      })
      test('dynamic ip', async () => {
        await expect(arp.is('dynamic', '192.168.2.1')).resolves.toBe(true)
      })
      test('undefined address', async () => {
        await expect(arp.is('undefined', '0.0.0.0')).resolves.toBe(true)
      })
    })
  })

  describe('Validation works properly', () => {
    describe('MAC addresses', () => {
      test('toIP() throws on invalid mac', async () => {
        await expect(arp.toIP('not:a:mac')).rejects.toThrowError('Invalid MAC')
      })
      test('is() throws on invalid mac', async () => {
        await expect(arp.is('undefined', 'not:a:mac')).rejects.toThrowError('Invalid address')
      })
      test('fromPrefix() throws on invalid mac', async () => {
        await expect(arp.fromPrefix('not:a:mac')).rejects.toThrowError('Invalid Prefix')
      })
    })
    describe('IP addresses', () => {
      test('Throw on invalid ip', async () => {
        await expect(arp.toMAC('not.an.ip')).rejects.toThrowError('Invalid IP')
      })
      test('is() throws on invalid ip', async () => {
        await expect(arp.is('undefined', 'not.an.ip')).rejects.toThrowError('Invalid address')
      })
    })
  })
})
