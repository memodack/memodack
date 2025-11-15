import { type ITextService, TextService } from "../src/services/text.service";

describe("TextService", () => {
  describe("truncate", () => {
    let service: ITextService;

    beforeEach(() => {
      service = new TextService();
    });

    it("returns an empty string if text = ''", () => {
      expect(service.truncate("")).toBe("");
    });

    it("does not truncate if length ≤ 3", () => {
      expect(service.truncate("abc")).toBe("abc");
      expect(service.truncate("a")).toBe("a");
      expect(service.truncate("hi")).toBe("hi");
    });

    it("truncates from the right by default, keeping 3 characters", () => {
      expect(service.truncate("abcdefgh")).toBe("abc...");
      expect(service.truncate("hello")).toBe("hel...");
    });

    it("truncates from the left if position = 'left', keeping 3 characters", () => {
      expect(service.truncate("abcdefgh", "left")).toBe("...fgh");
      expect(service.truncate("hello", "left")).toBe("...llo");
    });
  });
});
