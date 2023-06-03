/**
 * 公共的localStorage类
 */
export default class MyStore {
	public prefix: string; // 前缀

	constructor(name = "") {
		this.prefix = name;
	}

	/**
	 * 取出store里的值
	 * @param key 键
	 */
	get(key: string) {
		const theKey = this.prefix ? this.prefix : key;
		const value = localStorage.getItem(theKey);
		if (!value) {
			return null;
		}
		if (this.prefix) {
			let theValue = JSON.parse(value);
			theValue = theValue[key];
			if (!theValue) {
				return null;
			}
			return theValue;
		}
		return JSON.parse(value);
	}

	/**
	 * 设置store的值
	 * @param key 键
	 * @param value 值
	 */
	set(key: string, value: any) {
		if (this.prefix) {
			let theValue: any = localStorage.getItem(this.prefix);
			theValue = theValue ? JSON.parse(theValue) : {};
			if (theValue) {
				theValue = {
					...theValue,
					[key]: value
				};
			} else {
				theValue = {
					[key]: value
				};
			}
			localStorage.setItem(this.prefix, JSON.stringify(theValue));
		} else {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	/**
	 * 删除一个值或一个命名空间下的所有值
	 * @param {boolean} all 是否清除命名空间下所有值
	 */
	remove(key: string, all: boolean) {
		if (this.prefix) {
			if (all) {
				localStorage.removeItem(key);
			} else {
				this.set(key, null);
			}
		} else {
			localStorage.removeItem(key);
		}
	}

	/**
	 * 清除所有
	 */
	clearStorage = () => {
		localStorage.clear();
	};
}
