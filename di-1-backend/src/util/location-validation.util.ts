export default class IsValidLocation {

  private static instance: IsValidLocation;

  public validateLocation (location: string): boolean {
    const trimmed = location.trim();
  
    return (
      trimmed.length > 0 &&
      isNaN(Number(trimmed)) &&
      /^[A-Za-z\s\-]+$/.test(trimmed)
    );
  }

  public static getInstance(): IsValidLocation {
    if (!IsValidLocation.instance) {
      IsValidLocation.instance = new IsValidLocation();
    }

    return IsValidLocation.instance;
  }

}
