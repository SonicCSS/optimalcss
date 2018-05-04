type ClassName = string;
type ClassIndex = number;
type GeneratedClass = [ ClassName, ClassIndex ];

// Given how we generate classes, the only invalid classNames would be
// ones that start with a number.
function isClassNameValid(className: string) : string {
    return isNaN(className[0]);
}

function getIndexOfNextValidClass(currentIndex: number) : number {
    return currentIndex * 10;
}

export function generateClassName(currentIndex: ClassIndex) : GeneratedClass {
    const className = (currentIndex || 1).toString(36);

    if (isClassNameValid(className)) {
        return [className, currentIndex];
    } else {
        return generateClassName(getIndexOfNextValidClass(currentIndex));
    }
}